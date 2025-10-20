from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, MarcaViewSet, CategoriaViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'marcas', MarcaViewSet)
router.register(r'categorias', CategoriaViewSet)  # <- nuevo

urlpatterns = router.urls
