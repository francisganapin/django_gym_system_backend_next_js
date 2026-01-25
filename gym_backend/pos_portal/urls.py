from django.urls import path,include 
from rest_framework import routers
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'product', views.ProductViewSet)
router.register(r'transaction', views.TransactionViewSet)
router.register(r'cart-item', views.CartItemViewSet)




urlpatterns = [
    path('', include(router.urls)),
]