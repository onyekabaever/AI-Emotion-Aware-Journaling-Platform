from rest_framework import serializers

class TextAnalyzeSerializer(serializers.Serializer):
    text = serializers.CharField()

class SpeechAnalyzeSerializer(serializers.Serializer):
    # audio sent as multipart/form-data
    audio = serializers.FileField()

class CombinedAnalyzeSerializer(serializers.Serializer):
    text = serializers.CharField(required=False, allow_blank=True)
    audio = serializers.FileField(required=False)
