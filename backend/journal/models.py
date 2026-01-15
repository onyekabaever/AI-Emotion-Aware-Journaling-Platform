from django.conf import settings
from django.db import models

class JournalEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="entries")

    title = models.CharField(max_length=200, blank=True)
    text = models.TextField(blank=True)

    audio_file = models.FileField(upload_to="journal_audio/", blank=True, null=True)

    # Store model outputs
    text_emotions = models.JSONField(blank=True, null=True)
    speech_emotions = models.JSONField(blank=True, null=True)
    combined_emotions = models.JSONField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title or 'Entry'} ({self.created_at.date()})"

