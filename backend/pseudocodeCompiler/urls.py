from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/', include('apps.api.urls')),
    path('execution/', include('apps.api.execution_engine.urls')),
]