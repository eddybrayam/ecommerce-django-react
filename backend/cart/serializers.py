# backend/cart/serializers.py
from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductSerializer



class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'quantity', 'added_at')


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'user', 'session_key', 'created_at', 'updated_at', 'is_active', 'items')