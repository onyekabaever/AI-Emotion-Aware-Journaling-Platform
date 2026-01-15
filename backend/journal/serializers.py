from rest_framework import serializers
from .models import JournalEntry

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = "__all__"
        # User and timestamps are set server-side; allow emotion JSON fields to be written
        read_only_fields = ["user", "created_at"]
