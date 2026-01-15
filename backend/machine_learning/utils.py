from __future__ import annotations

from typing import Any, Dict
import logging
import math
import os

EMOTION_KEYS = ["joy", "sadness", "anger", "fear", "surprise", "neutral"]


logger = logging.getLogger(__name__)


def _normalise(key: str) -> str:
    return key.strip().lower()


def scores_to_emotion(scores: Dict[str, float]) -> Dict[str, float]:
    """Map raw label scores from the ONNX models into the 6 canonical
    emotion dimensions expected by the frontend.

    This assumes the underlying model was trained with labels like
    joy/sadness/anger/fear/surprise/neutral (case-insensitive). Missing
    labels simply default to 0.0 so the API remains robust.
    """

    normalised = {_normalise(k): float(v) for k, v in scores.items()}
    out: Dict[str, float] = {}
    for k in EMOTION_KEYS:
        out[k] = normalised.get(k, 0.0)
    return out


def emotion_to_sentiment(emotion: Dict[str, float]) -> float:
    """Derive a simple sentiment index in [-1, 1] from emotion scores.

    Positive sentiment is driven by joy and surprise; negative by sadness,
    anger, and fear. This mirrors the heuristic previously used in the
    frontend fallback, but runs entirely on the backend.
    """

    joy = float(emotion.get("joy", 0.0))
    surprise = float(emotion.get("surprise", 0.0))
    sadness = float(emotion.get("sadness", 0.0))
    anger = float(emotion.get("anger", 0.0))
    fear = float(emotion.get("fear", 0.0))

    pos = joy + surprise
    neg = sadness + anger + fear
    denom = pos + neg
    if denom <= 0.0:
        return 0.0

    raw = (pos - neg) / denom
    return max(-1.0, min(1.0, raw))


def analyze_text(text: str) -> Dict[str, Any]:
    """Run the text ONNX model and return emotion + sentiment + raw output."""

    from .services.text_onnx import predict_text  # local import to avoid cycles

    raw = predict_text(text)
    scores = raw.get("scores", {}) or {}
    if not isinstance(scores, dict):
        scores = {}

    emotion = scores_to_emotion(scores)  # type: ignore[arg-type]
    sentiment = emotion_to_sentiment(emotion)
    return {"emotion": emotion, "sentiment": sentiment, "raw": raw}


def analyze_speech(audio_path: str) -> Dict[str, Any]:
    """Run the speech ONNX model and return emotion + sentiment + raw output.

    If the environment cannot decode the audio format (e.g. WEBM on Windows
    without ffmpeg/libsndfile), we gracefully fall back to a lightweight
    heuristic based on file size rather than raising a 500 error.
    """

    from .services.speech_onnx import predict_speech  # local import to avoid cycles

    try:
        raw = predict_speech(audio_path)
        scores = raw.get("scores", {}) or {}
        if not isinstance(scores, dict):
            scores = {}

        emotion = scores_to_emotion(scores)  # type: ignore[arg-type]
        sentiment = emotion_to_sentiment(emotion)
        return {"emotion": emotion, "sentiment": sentiment, "raw": raw}
    except Exception as exc:  # noqa: BLE001
        logger.exception("Speech ONNX model failed for %s; using heuristic fallback", audio_path)

        try:
            size = max(1, os.path.getsize(audio_path))
        except OSError:
            size = 1

        # Mirror the simple heuristic used in the frontend fallback
        n = max(1.0, math.log10(float(size)))
        emoc = {
            "joy": min(1.0, n / 6.0),
            "sadness": max(0.0, 1.0 - n / 8.0),
            "anger": 0.2,
            "fear": 0.2,
            "surprise": 0.3,
            "neutral": 0.5,
        }
        sentiment = emotion_to_sentiment(emoc)
        return {
            "emotion": emoc,
            "sentiment": sentiment,
            "raw": {
                "scores": emoc,
                "fallback": True,
                "reason": str(exc),
            },
        }
