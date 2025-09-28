from django.urls import path
from . import views


app_name = 'accounts'

urlpatterns = [
    #path("health/", views.health, name="health"), #ruta de prueba
    path("register/",views.register,name="register"), 
    path("activate/<uidb64>/<token>/", views.activate, name="activate"),
]