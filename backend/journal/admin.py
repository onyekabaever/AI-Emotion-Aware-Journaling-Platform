from django.contrib import admin

from .models import JournalEntry


@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "title", "text","text_emotions","speech_emotions","combined_emotions","created_at")
	search_fields = ("title", "text", "user__username")
	list_filter = ("created_at",)
