from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from .tokens import token_generator, check_token


@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Generar token de activación
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)
        activation_link = f"http://127.0.0.1:8000/api/accounts/activate/{uidb64}/{token}/"

        # 👇 Aquí debe estar la llamada al envío de email
        from .emails import send_activation_email
        send_activation_email(user, activation_link)

        return Response(
            {"detail": "Usuario creado. Se envió un correo para activación."},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
def activate(request, uidb64, token):
    user = check_token(uidb64, token)
    if user:
        user.is_active = True
        user.save()
        return Response({"detail": "Cuenta activada correctamente."}, status=status.HTTP_200_OK)
    return Response({"detail": "Enlace inválido o expirado."}, status=status.HTTP_400_BAD_REQUEST)