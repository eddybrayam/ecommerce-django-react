from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Client, Role
from .emails import send_verification_email  # 👈 añadimos esto
from rest_framework import serializers
from django.contrib.auth import get_user_model



class ClientRegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    address = serializers.CharField(max_length=255)
    dni = serializers.RegexField(r"^\d{8}$")
    phone = serializers.CharField(allow_blank=True, required=False)
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password2": "Las contraseñas no coinciden."})
        return data

    def validate_email(self, value):
        if User.objects.filter(username=value).exists() or User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con ese email.")
        return value

    def validate_dni(self, value):
        if Client.objects.filter(dni=value).exists():
            raise serializers.ValidationError("El DNI ya está registrado.")
        return value

    def create(self, validated_data):
        first_name = validated_data["first_name"]
        last_name = validated_data["last_name"]
        email = validated_data["email"].lower()
        address = validated_data["address"]
        dni = validated_data["dni"]
        phone = validated_data.get("phone") or None
        password = validated_data["password"]

        # 👇 CAMBIO 1: usuario inactivo hasta verificar
        user = User(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_active=False
        )
        user.set_password(password)
        user.save()

        # Rol y cliente asociado
        role_client, _ = Role.objects.get_or_create(name="CLIENT", defaults={"description": "Cliente"})
        Client.objects.create(
            user=user,
            role=role_client,
            first_name=first_name,
            last_name=last_name,
            address=address,
            dni=dni,
            phone=phone,
        )

        # 👇 CAMBIO 2: enviar correo de verificación
        request = self.context.get("request")
        send_verification_email(request, user)

        return user


class VerifyEmailSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()

class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()





User = get_user_model()

class EmailRegisterSerializer(serializers.Serializer):
    username = serializers.EmailField()
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    address = serializers.CharField(max_length=255)
    dni = serializers.RegexField(r"^\d{8}$")
    phone = serializers.CharField(allow_blank=True, required=False)
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password2": "Las contraseñas no coinciden."})
        if data["username"].lower() != data["email"].lower():
            raise serializers.ValidationError({"username": "username debe ser igual al email."})
        return data

    def validate_email(self, value):
        v = value.lower()
        if User.objects.filter(username=v).exists() or User.objects.filter(email=v).exists():
            raise serializers.ValidationError("Ya existe un usuario con ese email.")
        return v

    def validate_dni(self, value):
        if Client.objects.filter(dni=value).exists():
            raise serializers.ValidationError("El DNI ya está registrado.")
        return value

    def create(self, validated_data):
        first_name = validated_data["first_name"].strip()
        last_name  = validated_data["last_name"].strip()
        email      = validated_data["email"].lower().strip()
        address    = validated_data["address"].strip()
        dni        = validated_data["dni"].strip()
        phone      = (validated_data.get("phone") or "").strip() or None
        password   = validated_data["password"]

        # Usuario INACTIVO hasta verificar correo
        user = User(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_active=False,
        )
        user.set_password(password)
        user.save()

        role_client, _ = Role.objects.get_or_create(name="CLIENT", defaults={"description": "Cliente"})
        Client.objects.create(
            user=user,
            role=role_client,
            first_name=first_name,
            last_name=last_name,
            address=address,
            dni=dni,
            phone=phone,
        )
        return user
