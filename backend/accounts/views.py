from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

from .serializers import ClientRegisterSerializer
from .models import Role, Client, GoogleAccount

# --- NUEVO helper: soporta uno o varios client IDs ---
def _get_google_client_ids():
    ids = getattr(settings, "GOOGLE_CLIENT_IDS", None)
    if ids:
        return ids
    cid = getattr(settings, "GOOGLE_CLIENT_ID", "")
    return [cid] if cid else []


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


class GoogleOAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("credential") or request.data.get("id_token")
        if not token:
            return Response({"detail": "Falta credential"}, status=status.HTTP_400_BAD_REQUEST)

        # 1) Verifica firma y 'iss' SIN forzar 'aud' aquí (para poder diagnosticar)
        try:
            idinfo = google_id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
            )
        except Exception as e:
            return Response({"detail": f"Token inválido: {e}"}, status=status.HTTP_400_BAD_REQUEST)

        iss = idinfo.get("iss")
        if iss not in ["accounts.google.com", "https://accounts.google.com"]:
            return Response({"detail": f"Issuer inválido: {iss}"}, status=status.HTTP_400_BAD_REQUEST)

        # 2) Comprueba 'aud' contra tus client IDs permitidos
        aud = idinfo.get("aud")
        allowed = _get_google_client_ids()
        if aud not in allowed:
            # ← Este mensaje te dirá exactamente qué client_id trae el token
            return Response(
                {"detail": "audiencia no permitida", "aud": aud, "allowed": allowed},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = (idinfo.get("email") or "").lower()
        if not email:
            return Response({"detail": "No se pudo obtener el email."}, status=status.HTTP_400_BAD_REQUEST)

        first_name = idinfo.get("given_name", "")[:150]
        last_name  = idinfo.get("family_name", "")[:150]
        sub        = idinfo.get("sub")
        picture    = idinfo.get("picture", "")

        # crear/obtener User (username = email)
        user = User.objects.filter(username=email).first()
        created_user = False
        if not user:
            user = User(username=email, email=email, first_name=first_name, last_name=last_name, is_active=True)
            user.set_unusable_password()
            user.save()
            created_user = True

        # asegurar Client + rol CLIENT
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

        # vincular GoogleAccount
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
