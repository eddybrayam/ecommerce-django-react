from rest_framework.routers import DefaultRouter
from .views import MyOrdersViewSet

router = DefaultRouter()
router.register(r"orders/mine", MyOrdersViewSet, basename="my-orders")
urlpatterns = router.urls