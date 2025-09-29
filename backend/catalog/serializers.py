from rest_framework import serializers 
from .models import Category, Product, StockHistory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class StockHistorySerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField(read_only=True)  # Muestra el nombre del producto

    class Meta:
        model = StockHistory
        fields = "__all__"

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    stock_history = StockHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = "__all__"