# backend/products/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.generics import get_object_or_404
from django.db.models import Avg, Count

from .models import Product, Marca, Categoria, Review, ReviewComment
from .serializers import (
    ProductSerializer,
    MarcaSerializer,
    CategoriaSerializer,
    ReviewSerializer,
    ReviewCommentSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Product.objects.all().annotate(
            rating_avg=Avg("resenas__calificacion"),
            rating_count=Count("resenas", distinct=True),
        )

        # --- Filtros existentes (no tocado)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(nombre__icontains=search)

        categoria = self.request.query_params.get('categoria')
        if categoria and categoria != "all":
            qs = qs.filter(categoria__id=categoria)

        marca = self.request.query_params.get('marca')
        if marca:
            qs = qs.filter(marca__id=marca)

        min_precio = self.request.query_params.get('min_precio')
        max_precio = self.request.query_params.get('max_precio')
        if min_precio:
            try:
                qs = qs.filter(precio__gte=float(min_precio))
            except ValueError:
                pass
        if max_precio:
            try:
                qs = qs.filter(precio__lte=float(max_precio))
            except ValueError:
                pass

        return qs

    # /api/products/{id}/reviews/  (GET lista, POST crea/actualiza mi reseña)
    @action(
        detail=True,
        methods=["get", "post"],
        url_path="reviews",
        permission_classes=[AllowAny],
        serializer_class=ReviewSerializer,
    )
    def reviews(self, request, pk=None):
        producto = self.get_object()

        if request.method.lower() == "get":
            qs = (
                Review.objects.filter(producto=producto)
                .select_related("usuario")
                .order_by("-creado_en")
            )
            return Response(ReviewSerializer(qs, many=True).data, status=status.HTTP_200_OK)

        # POST requiere login
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        calificacion = request.data.get("calificacion")
        comentario = (request.data.get("comentario") or "").strip()

        try:
            calificacion = int(calificacion)
        except (TypeError, ValueError):
            return Response({"detail": "calificacion debe ser un entero 1..5"}, status=400)
        if not (1 <= calificacion <= 5):
            return Response({"detail": "calificacion fuera de rango (1..5)"}, status=400)

        review, created = Review.objects.update_or_create(
            producto=producto,
            usuario=request.user,
            defaults={"calificacion": calificacion, "comentario": comentario},
        )
        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    # /api/products/{id}/reviews/{review_id}/comments/  (GET lista, POST crea)
    @action(
        detail=True,
        methods=["get", "post"],
        url_path=r"reviews/(?P<review_id>[^/.]+)/comments",
        permission_classes=[AllowAny],
        serializer_class=ReviewCommentSerializer,
    )
    def review_comments(self, request, pk=None, review_id=None):
        producto = self.get_object()
        review = get_object_or_404(Review, id=review_id, producto=producto)

        if request.method.lower() == "get":
            qs = review.comentarios.select_related("usuario").order_by("creado_en")
            return Response(ReviewCommentSerializer(qs, many=True).data, status=200)

        # POST requiere login
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        texto = (request.data.get("texto") or "").strip()
        if not texto:
            return Response({"detail": "El comentario no puede estar vacío."}, status=400)

        c = ReviewComment.objects.create(review=review, usuario=request.user, texto=texto)
        return Response(ReviewCommentSerializer(c).data, status=status.HTTP_201_CREATED)

    # /api/products/{id}/reviews/mine/  (DELETE borra mi reseña)
    @action(
        detail=True,
        methods=["delete"],
        url_path="reviews/mine",
        permission_classes=[IsAuthenticated],
    )
    def delete_my_review(self, request, pk=None):
        producto = self.get_object()
        user = request.user
        deleted, _ = Review.objects.filter(producto=producto, usuario=user).delete()
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(
            {"detail": "No tienes reseña en este producto."},
            status=status.HTTP_404_NOT_FOUND,
        )


class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all().order_by("nombre")
    serializer_class = CategoriaSerializer
