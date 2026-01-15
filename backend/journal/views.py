import logging

from rest_framework import viewsets, permissions
from .models import JournalEntry
from .serializers import JournalEntrySerializer
from machine_learning.utils import analyze_text, analyze_speech

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        entry = serializer.save(user=self.request.user)
        self._run_models(entry)

    def perform_update(self, serializer):
        entry = serializer.save()
        self._run_models(entry)

    def _run_models(self, entry: JournalEntry) -> None:
        """Run backend AI models on the journal entry's text/audio and
        persist the emotional feedback on the same row.

                - Text → text_emotions JSON
                - Audio file → speech_emotions JSON
                - combined_emotions mirrors the primary modality: text when there is
                    only text; speech when audio is present (so voice feedback appears
                    exactly as predicted without mixing with text).
        """

        logger = logging.getLogger(__name__)

        try:
            combined_emotion = None
            combined_sentiment = None

            if entry.text and entry.text.strip():
                text_result = analyze_text(entry.text)
                # Full raw output from the text model
                entry.text_emotions = text_result["raw"]

                emotion = text_result["emotion"]
                sentiment = float(text_result["sentiment"])

                combined_emotion = emotion
                combined_sentiment = sentiment

            if entry.audio_file:
                speech_result = analyze_speech(entry.audio_file.path)
                entry.speech_emotions = speech_result["raw"]

                # Prefer the raw speech scores (8 labels) for voice entries so
                # the frontend can show the exact voice AI feedback. Fall back
                # to the canonical 6-label mapping if raw scores are missing.
                raw_scores = None
                raw_payload = speech_result.get("raw") if isinstance(speech_result, dict) else None
                if isinstance(raw_payload, dict):
                    raw_scores = raw_payload.get("scores") if isinstance(raw_payload.get("scores"), dict) else None

                emotion = raw_scores or speech_result["emotion"]
                sentiment = float(speech_result["sentiment"])

                # For entries with audio we let speech drive the combined
                # emotions so voice feedback is not averaged with text.
                combined_emotion = emotion
                combined_sentiment = sentiment

            if combined_emotion is not None and combined_sentiment is not None:
                entry.combined_emotions = {
                    "emotion": combined_emotion,
                    "sentiment": float(combined_sentiment),
                }

            entry.save(update_fields=[
                "text_emotions",
                "speech_emotions",
                "combined_emotions",
            ])
        except Exception:
            # Never block saving the journal entry because of model issues.
            logger.exception("Failed to run emotion models for journal entry %s", entry.pk)

