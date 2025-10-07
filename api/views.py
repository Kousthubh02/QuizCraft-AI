from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PDF, Quiz, Attempt
from .serializers import PDFSerializer, QuizSerializer, AttemptSerializer, PDFUploadSerializer
from .utils import extract_text_from_pdf, generate_questions_from_text
import os


class PDFViewSet(viewsets.ModelViewSet):
    queryset = PDF.objects.all()
    serializer_class = PDFSerializer
    parser_classes = (MultiPartParser, FormParser)

    @action(detail=False, methods=['post'])
    def upload(self, request, *args, **kwargs):
        """Accept multipart file upload to create a PDF record."""
        serializer = PDFUploadSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(PDFSerializer(instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    @action(detail=False, methods=['post'])
    def generate(self, request, *args, **kwargs):
        """Generate a quiz from a PDF id or uploaded text. POST body: {pdf_id: int, n: int, types: ['mcq','saq']}"""
        pdf_id = request.data.get('pdf_id')
        n = int(request.data.get('n', 5))
        types = request.data.get('types', ['mcq'])

        pdf = None
        if pdf_id:
            try:
                pdf = PDF.objects.get(id=pdf_id)
            except PDF.DoesNotExist:
                return Response({'detail': 'PDF not found'}, status=404)
            # Use storage path
            file_path = pdf.file.path
            text = extract_text_from_pdf(file_path)
        else:
            text = request.data.get('text', '')

        try:
            questions = generate_questions_from_text(text, n_questions=n, types=types)
        except Exception as e:
            return Response({'detail': str(e)}, status=500)

        # create Quiz and Questions/Choices
        quiz = Quiz.objects.create(pdf=pdf if pdf_id else None, title=request.data.get('title', 'Generated Quiz'))
        from .models import Question, Choice
        for q in questions:
            qobj = Question.objects.create(quiz=quiz, text=q.get('question'))
            if q.get('choices'):
                for c in q['choices']:
                    Choice.objects.create(question=qobj, text=c.get('text', c), is_correct=c.get('is_correct', False))

        return Response(QuizSerializer(quiz).data, status=201)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit answers for a quiz. POST body: {answers: [{question: id, answer: ...}, ...]}"""
        try:
            quiz = self.get_object()
        except Exception:
            return Response({'detail': 'Quiz not found'}, status=404)

        answers = request.data.get('answers', [])
        # naive scoring: for each question, find correct choices and compare
        total = 0
        correct = 0
        from .models import Question, Choice
        for a in answers:
            total += 1
            qid = a.get('question')
            ans = a.get('answer')
            try:
                q = Question.objects.get(id=qid, quiz=quiz)
            except Question.DoesNotExist:
                continue
            correct_choices = list(q.choices.filter(is_correct=True).values_list('id', flat=True))
            # support index or text
            if isinstance(ans, int) and ans in correct_choices:
                correct += 1
            else:
                # compare by text
                if q.choices.filter(text__iexact=str(ans), is_correct=True).exists():
                    correct += 1

        score = (correct / total) * 100 if total else 0
        # create Attempt
        Attempt.objects.create(user=request.user if request.user.is_authenticated else None, quiz=quiz, score=score)
        return Response({'score': score, 'correct': correct, 'total': total})


class AttemptViewSet(viewsets.ModelViewSet):
    queryset = Attempt.objects.all()
    serializer_class = AttemptSerializer
