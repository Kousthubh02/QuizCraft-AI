from rest_framework import serializers
from .models import PDF, Quiz, Question, Choice, Attempt


class ChoiceSerializer(serializers.ModelSerializer):
    # public-facing serializer: don't expose is_correct
    class Meta:
        model = Choice
        fields = ('id', 'text')


class ChoiceInternalSerializer(serializers.ModelSerializer):
    # internal use: includes is_correct for server-side creation
    class Meta:
        model = Choice
        fields = ('id', 'text', 'is_correct')


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'text', 'choices')


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ('id', 'title', 'description', 'pdf', 'questions')


class PDFSerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True, read_only=True)

    class Meta:
        model = PDF
        fields = ('id', 'title', 'file', 'uploaded_at', 'quizzes')


class PDFUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDF
        fields = ('id', 'title', 'file')

    def create(self, validated_data):
        # title optional; if not provided, derive from file name
        if not validated_data.get('title') and validated_data.get('file'):
            validated_data['title'] = validated_data['file'].name
        return super().create(validated_data)


class AttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attempt
        fields = ('id', 'user', 'quiz', 'score', 'submitted_at')
