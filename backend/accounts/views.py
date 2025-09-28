from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

from .serializers import (
    ClientRegisterSerializer,
    VerifyEmailSerializer,
    ResendVerificationSerializer,
    EmailRegisterSerializer,          # ✅ NUEVO
)
from .models import Role, Client, GoogleAccount
from .tokens import email_verification_token
from .emails import send_verification_email


# ==========================
# 🔹 Registro cliente (flujo de tu compañero) => devuelve JWT
# ==========================
class ClientRegisterView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ClientRegisterSerializer

    def create(self, request, *args, **kwargs):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


# ==========================
# 🔹 Registro con verificación por correo (TU FLUJO)
# ==========================
class EmailRegisterView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = EmailRegisterSerializer

    def create(self, request, *args, **kwargs):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()  # se crea is_active=False dentro del serializer
        # envía el correo con el enlace de verificación
        send_verification_email(request, user)
        return Response(
            {"detail": "Cuenta creada. Revisa tu correo para activar tu cuenta."},
            status=status.HTTP_201_CREATED,
        )


# ==========================
# 🔹 Google OAuth
# ==========================
def _get_google_client_ids():
    ids = getattr(settings, "GOOGLE_CLIENT_IDS", None)
    if ids:
        return ids
    cid = getattr(settings, "GOOGLE_CLIENT_ID", "")
    return [cid] if cid else []


class GoogleOAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("credential") or request.data.get("id_token")
        if not token:
            return Response({"detail": "Falta credential"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = google_id_token.verify_oauth2_token(token, google_requests.Request())
        except Exception as e:
            return Response({"detail": f"Token inválido: {e}"}, status=status.HTTP_400_BAD_REQUEST)

        iss = idinfo.get("iss")
        if iss not in ["accounts.google.com", "https://accounts.google.com"]:
            return Response({"detail": f"Issuer inválido: {iss}"}, status=status.HTTP_400_BAD_REQUEST)

        aud = idinfo.get("aud")
        allowed = _get_google_client_ids()
        if aud not in allowed:
            return Response({"detail": "audiencia no permitida", "aud": aud, "allowed": allowed},
                            status=status.HTTP_400_BAD_REQUEST)

        email = (idinfo.get("email") or "").lower()
        if not email:
            return Response({"detail": "No se pudo obtener el email."}, status=status.HTTP_400_BAD_REQUEST)

        first_name = idinfo.get("given_name", "")[:150]
        last_name  = idinfo.get("family_name", "")[:150]
        sub        = idinfo.get("sub")
        picture    = idinfo.get("picture", "")

        user = User.objects.filter(username=email).first()
        created_user = False
        if not user:
            user = User(username=email, email=email, first_name=first_name, last_name=last_name, is_active=True)
            user.set_unusable_password()
            user.save()
            created_user = True

        role_client, _ = Role.objects.get_or_create(name="CLIENT", defaults={"description": "Cliente"})
        Client.objects.get_or_create(
            user=user,
            defaults={
                "role": role_client,
                "first_name": first_name or user.first_name or "",
                "last_name":  last_name or user.last_name or "",
                "address": "",
                "dni": f"GN{sub[-8:]}" if sub else "",
                "phone": None,
            },
        )

        if sub:
            GoogleAccount.objects.get_or_create(
                user=user,
                defaults={
                    "sub": sub,
                    "email": email,
                    "picture": picture,
                    "given_name": first_name,
                    "family_name": last_name,
                },
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "created": created_user,
            }
        )


# ==========================
# 🔹 Verificación de correo
# ==========================
User = get_user_model()

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"detail": "Enlace inválido."}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_active:
            return Response({"detail": "Tu email ya está verificado."}, status=status.HTTP_200_OK)

        if email_verification_token.check_token(user, token):
            user.is_active = True
            user.save(update_fields=["is_active"])
            return Response({"detail": "Email verificado. Ya puedes iniciar sesión."}, status=status.HTTP_200_OK)

        return Response({"detail": "Token inválido o expirado."}, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailByQueryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        ser = VerifyEmailSerializer(data=request.query_params)
        ser.is_valid(raise_exception=True)
        uidb64 = ser.validated_data["uidb64"]
        token = ser.validated_data["token"]

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"detail": "Enlace inválido."}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_active:
            return Response({"detail": "Tu email ya está verificado."}, status=status.HTTP_200_OK)

        if email_verification_token.check_token(user, token):
            user.is_active = True
            user.save(update_fields=["is_active"])
            return Response({"detail": "Email verificado. Ya puedes iniciar sesión."}, status=status.HTTP_200_OK)

        return Response({"detail": "Token inválido o expirado."}, status=status.HTTP_400_BAD_REQUEST)


class ResendVerificationEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = ResendVerificationSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data["email"]
        user = User.objects.get(email__iexact=email)

        send_verification_email(request, user)
        return Response({"detail": "Te enviamos un nuevo correo de verificación."}, status=status.HTTP_200_OK)


# ==========================
# 🔹 Otros endpoints
# ==========================
class MeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        u = request.user
        client = getattr(u, "client", None)
        role_name = client.role.name if client else None
        return Response(
            {
                "id": u.id,
                "email": u.email,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "role": role_name,
            }
        )


class PingView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({"pong": True})
