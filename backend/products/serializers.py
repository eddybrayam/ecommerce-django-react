from rest_framework import serializers
from .models import Product, Marca, Categoria
import json


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ["id", "nombre", "descripcion"]  # puedes quitar descripcion si no la necesitas


class ProductSerializer(serializers.ModelSerializer):
    marca = serializers.PrimaryKeyRelatedField(queryset=Marca.objects.all(), allow_null=True)
    imagenes = serializers.SerializerMethodField()
    categoria = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), allow_null=False)
    

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


