import io
import json
import logging
import os
import subprocess
from pathlib import Path

import librosa
import numpy as np
import onnxruntime as ort
import soundfile as sf

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "models" / "notebook" / "models" / "speech_emotions_model"

ONNX_PATH = MODEL_DIR / "onnx" / "speech_emotion_model.onnx"
LABELS_PATH = MODEL_DIR / "labels.json"

# Must match your training
SR = 16000
MAX_SEC = 6.0
T = int(SR * MAX_SEC)

logger = logging.getLogger(__name__)
FFMPEG_BIN = os.getenv("FFMPEG_PATH", "ffmpeg")

session = ort.InferenceSession(ONNX_PATH.as_posix(), providers=["CPUExecutionProvider"])

labels = json.load(open(LABELS_PATH, "r", encoding="utf-8"))
labels_list = labels["labels"] if isinstance(labels, dict) and "labels" in labels else labels

def softmax(x):
    x = x - np.max(x)
    e = np.exp(x)
    return e / e.sum()


def _decode_with_ffmpeg(path: str):
    """Decode arbitrary audio to PCM wav via ffmpeg, returning (audio, sr).

    This bypasses audioread/soundfile limitations on Windows for WEBM/Opus.
    """

    cmd = [
        FFMPEG_BIN,
        "-v",
        "error",
        "-i",
        path,
        "-ac",
        "1",
        "-ar",
        str(SR),
        "-f",
        "wav",
        "-",
    ]
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    data = io.BytesIO(proc.stdout)
    audio, sr = sf.read(data)
    return audio, sr

def load_and_prepare_audio(path: str):
    """Load audio from disk and return a tensor shaped (1, 1, T).

    Primary loader is soundfile; if the format is not recognised (e.g. WEBM),
    we gracefully fall back to librosa.load which supports more container
    formats via ffmpeg/audioread.
    """

    try:
        audio, sr = sf.read(path)
    except Exception as exc_sf:  # soundfile does not support WEBM, etc.
        logger.warning("soundfile could not read %s (%s); trying ffmpeg decode", path, exc_sf)
        try:
            audio, sr = _decode_with_ffmpeg(path)
        except Exception as exc_ffmpeg:
            logger.warning("ffmpeg decode failed for %s (%s); falling back to librosa.load", path, exc_ffmpeg)
            # librosa.load returns mono by default when mono=True
            audio, sr = librosa.load(path, sr=SR, mono=True)

    if audio.ndim > 1:
        audio = audio.mean(axis=1)

    if sr != SR:
        audio = librosa.resample(audio.astype(np.float32), orig_sr=sr, target_sr=SR)

    if len(audio) > T:
        audio = audio[:T]
    else:
        audio = np.pad(audio, (0, T - len(audio)))

    return audio.astype("float32")[None, None, :]  # (1,1,T)

def predict_speech(audio_file_path: str):
    x = load_and_prepare_audio(audio_file_path)

    # The exported ONNX model expects the input tensor to be named
    # "input_values" (the default for Wav2Vec2-style models). Some older
    # code paths used "audio". We detect the correct name from the session
    # metadata and reshape if the model expects (batch, time) instead of
    # (batch, channels, time).
    inputs = session.get_inputs()
    first_input = inputs[0] if inputs else None
    input_name = first_input.name if first_input else "input_values"

    if x.ndim == 3 and first_input and len(first_input.shape or []) == 2:
        x_feed = x[:, 0, :]
    else:
        x_feed = x

    try:
        logits = session.run(["logits"], {input_name: x_feed})[0][0]
    except ValueError as exc:
        # Fallback for models that strictly require the canonical name.
        if "input_values" not in {input_name}:
            logits = session.run(["logits"], {"input_values": x_feed})[0][0]
        else:
            raise exc
    probs = softmax(logits)

    scores = {lab: float(p) for lab, p in zip(labels_list, probs)}
    top_label = labels_list[int(np.argmax(probs))]

    return {"scores": scores, "top_label": top_label}
