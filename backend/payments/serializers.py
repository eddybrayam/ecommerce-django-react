from rest_framework import serializers
from .models import PagoSimulado

class PagoSimuladoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagoSimulado
        fields = "__all__"
        read_only_fields = ["estado", "creado_en", "tarjeta_last4", "tarjeta_brand"]
