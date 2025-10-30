from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import Coupon

@api_view(['POST'])
def validate_coupon(request):
    code = request.data.get('code')
    total = float(request.data.get('total', 0))

    try:
        coupon = Coupon.objects.get(code__iexact=code)
        if not coupon.is_valid():
            return Response({"error": "Cupón expirado o inactivo"}, status=400)
        if total < coupon.min_amount:
            return Response({"error": "No cumples el monto mínimo para usar este cupón"}, status=400)
        
        discount = total * (coupon.discount_percent / 100)
        new_total = total - discount
        return Response({
            "valid": True,
            "discount": round(discount, 2),
            "new_total": round(new_total, 2)
        })
    except Coupon.DoesNotExist:
        return Response({"error": "Cupón no encontrado"}, status=404)
