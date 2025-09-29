from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ClientRegisterView,
    EmailRegisterView,        # tu nuevo registro con verificación
    GoogleOAuthView,
    MeView,
    PingView,
    VerifyEmailView,
    VerifyEmailByQueryView,
    ResendVerificationEmailView,
)

app_name = "accounts"

urlpatterns = [
    # 🔹 Registro con verificación por correo (tu flujo)
    path("register/", EmailRegisterView.as_view(), name="register"),

    # 🔹 Registro cliente (flujo de tu compañero, devuelve tokens altiro)
    path("register/client/", ClientRegisterView.as_view(), name="register-client"),

    # 🔹 Autenticación
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # 🔹 Google OAuth
    path("oauth/google/", GoogleOAuthView.as_view(), name="oauth-google"),

    # 🔹 Verificación de correo
    path("verify-email/<uidb64>/<token>/", VerifyEmailView.as_view(), name="verify-email"),
    path("verify-email/", VerifyEmailByQueryView.as_view(), name="verify-email-query"),
    path("resend-verification/", ResendVerificationEmailView.as_view(), name="resend-verification"),

    # 🔹 Otros
    path("me/", MeView.as_view(), name="me"),
    path("ping/", PingView.as_view(), name="ping"),
]
