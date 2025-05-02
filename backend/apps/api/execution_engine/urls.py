from django.urls import path
from .views import execute_code, execute_code_with_gemini

urlpatterns = [
    path('convert/', execute_code, name='convert_code'),
    path('convert/gemini/', execute_code_with_gemini, name='convert_code_gemini'),
]