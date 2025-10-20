from rest_framework import viewsets
from .models import Product, Marca, Categoria
from .serializers import ProductSerializer, MarcaSerializer,CategoriaSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()

        # --- 🔍 Filtro por búsqueda (nombre)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(nombre__icontains=search)

        # --- 🏷️ Filtro por categoría (si existe campo 'categoria')
        categoria = self.request.query_params.get('categoria')
        if categoria and categoria != "all":
            queryset = queryset.filter(categoria__id=categoria)

        # --- 🏭 Filtro por marca
        marca = self.request.query_params.get('marca')
        if marca:
            queryset = queryset.filter(marca__id=marca)

        # --- 💰 Filtro por rango de precio
        min_precio = self.request.query_params.get('min_precio')
        max_precio = self.request.query_params.get('max_precio')

        if min_precio:
            try:
                queryset = queryset.filter(precio__gte=float(min_precio))
            except ValueError:
                pass

        if max_precio:
            try:
                queryset = queryset.filter(precio__lte=float(max_precio))
            except ValueError:
                pass

        return queryset


class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all().order_by("nombre")
    serializer_class = CategoriaSerializer