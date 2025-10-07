from django.contrib import admin
from .models import PDF, Quiz, Question, Choice, Attempt


@admin.register(PDF)
class PDFAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'uploaded_at')


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'pdf')


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'quiz', 'text')


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'text', 'is_correct')


@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'quiz', 'score', 'submitted_at')
