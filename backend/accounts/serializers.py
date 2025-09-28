from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Client, Role

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
        # evitamos duplicados: usamos username=email
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

        user = User(username=email, email=email, first_name=first_name, last_name=last_name, is_active=True)
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
