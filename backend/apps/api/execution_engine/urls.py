from django.urls import path
from .views import execute_code

urlpatterns = [
    path('convert/', execute_code, name='convert_code'),
]