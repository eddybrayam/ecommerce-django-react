from rest_framework import serializers
from .models import Product, Marca
import json

class ProductSerializer(serializers.ModelSerializer):
    marca = serializers.PrimaryKeyRelatedField(queryset=Marca.objects.all(), allow_null=True)
    imagenes = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_imagenes(self, obj):
        try:
            return json.loads(obj.imagenes) if obj.imagenes else []
        except:
            return []
        
class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = '__all__'
