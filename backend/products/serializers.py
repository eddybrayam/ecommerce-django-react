from rest_framework import serializers
from .models import Product
import json

class ProductSerializer(serializers.ModelSerializer):
    imagenes = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_imagenes(self, obj):
        try:
            return json.loads(obj.imagenes) if obj.imagenes else []
        except:
            return []