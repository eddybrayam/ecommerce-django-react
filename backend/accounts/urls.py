from django.urls import path
from . import views
from .views import ClientRegisterView, GoogleOAuthView, MeView, PingView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

app_name = "accounts"

urlpatterns = [
    #path("health
    #Rutas de tu parte (correo de verificación)/", views.health, name="health"), #ruta de prueba
    path("register/",views.register,name="register"), 
    path("activate/<uidb64>/<token>/", views.activate, name="activate"),

    # Rutas de tu compañero (Google, JWT, etc.)
    path("register/client/", ClientRegisterView.as_view(), name="register-client"),
    path("oauth/google/", GoogleOAuthView.as_view(), name="oauth-google"),
    path("me/", MeView.as_view(), name="me"),
    path("ping/", PingView.as_view(), name="ping"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

]

