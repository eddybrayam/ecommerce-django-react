from rest_framework import serializers
from .models import Return, Complaint
from accounts.serializers import UserSerializer
from catalog.serializers import ProductSerializer
from orders.serializers import OrderSerializer

class ReturnSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Return
        fields = "__all__"

class ComplaintSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Complaint
        fields = "__all__"
