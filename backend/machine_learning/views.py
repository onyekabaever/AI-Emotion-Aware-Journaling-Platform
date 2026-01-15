import os
from django.conf import settings
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import TextAnalyzeSerializer, SpeechAnalyzeSerializer, CombinedAnalyzeSerializer
from .utils import analyze_text, analyze_speech

class AnalyzeTextView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        s = TextAnalyzeSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        result = analyze_text(s.validated_data["text"])
        # Frontend expects { emotion: EmotionScores, sentiment: number }
        return Response({"emotion": result["emotion"], "sentiment": result["sentiment"]})

class AnalyzeSpeechView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        s = SpeechAnalyzeSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        f = s.validated_data["audio"]
        os.makedirs(settings.MEDIA_ROOT / "tmp", exist_ok=True)
        tmp_path = settings.MEDIA_ROOT / "tmp" / f.name

        with open(tmp_path, "wb") as out:
            for chunk in f.chunks():
                out.write(chunk)

        result = analyze_speech(str(tmp_path))

        # cleanup
        try:
            os.remove(tmp_path)
        except Exception:
            pass

        # Frontend expects { emotion: EmotionScores, sentiment: number }
        return Response({"emotion": result["emotion"], "sentiment": result["sentiment"]})

class AnalyzeCombinedView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        s = CombinedAnalyzeSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        text = s.validated_data.get("text", "")
        audio = s.validated_data.get("audio", None)

        out = {}

        if text.strip():
            out["text"] = analyze_text(text)

        if audio is not None:
            os.makedirs(settings.MEDIA_ROOT / "tmp", exist_ok=True)
            tmp_path = settings.MEDIA_ROOT / "tmp" / audio.name
            with open(tmp_path, "wb") as fp:
                for chunk in audio.chunks():
                    fp.write(chunk)
            out["speech"] = analyze_speech(str(tmp_path))
            try:
                os.remove(tmp_path)
            except Exception:
                pass

        # optional: naive fusion (you can improve later)
        out["combined_hint"] = "Fusion strategy can be refined (weighted average / rules / late fusion)."

        return Response(out, status=status.HTTP_200_OK)

