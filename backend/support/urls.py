#support/urls.py

from django.urls import path
from .views import support_contact

urlpatterns=[
    path('contact/', support_contact, name= 'support_contact'),
]