from django.shortcuts import render

# Create your views here.
from rest_framework import permissions, viewsets, mixins
from .models import Order
from .serializers import OrderSerializer

class MyOrdersViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")
