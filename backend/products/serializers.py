from rest_framework import serializers
from django.db.models import Avg, Count
from .models import Product, Marca, Categoria,Review, ReviewComment
import json


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ["id", "nombre", "descripcion"]  # puedes quitar descripcion si no la necesitas


class ProductSerializer(serializers.ModelSerializer):
    marca = serializers.PrimaryKeyRelatedField(queryset=Marca.objects.all(), allow_null=True)
    imagenes = serializers.SerializerMethodField()
    categoria = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), allow_null=False)
    
    # 🆕 Campos agregados
    rating_avg = serializers.FloatField(read_only=True)
    rating_count = serializers.IntegerField(read_only=True)

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

# 🟨 Reseña
class ReviewSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source="usuario.username", read_only=True)
    comentarios_count = serializers.IntegerField(source="comentarios.count", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id", "usuario", "usuario_nombre",
            "calificacion", "comentario",
            "creado_en", "actualizado_en",
            "comentarios_count",  # 👈
        ]
        read_only_fields = ["usuario", "creado_en", "actualizado_en"]




class ReviewCommentSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source="usuario.username", read_only=True)

    class Meta:
        model = ReviewComment
        fields = ["id", "usuario", "usuario_nombre", "texto", "creado_en"]
        read_only_fields = ["usuario", "creado_en"]
