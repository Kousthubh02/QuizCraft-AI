from rest_framework import routers
from django.urls import path, include
from .views import PDFViewSet, QuizViewSet, AttemptViewSet

router = routers.DefaultRouter()
router.register('pdfs', PDFViewSet)
router.register('quizzes', QuizViewSet)
router.register('attempts', AttemptViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
