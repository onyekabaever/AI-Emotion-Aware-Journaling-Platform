from django.urls import path
from .views import AnalyzeTextView, AnalyzeSpeechView, AnalyzeCombinedView

urlpatterns = [
    path("analyze/text/", AnalyzeTextView.as_view(), name="analyze_text"),
    path("analyze/speech/", AnalyzeSpeechView.as_view(), name="analyze_speech"),
    path("analyze/combined/", AnalyzeCombinedView.as_view(), name="analyze_combined"),
]
