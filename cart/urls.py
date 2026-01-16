from django.urls import path
from . import views

urlpatterns = [
    path('cart/', views.CartDetail.as_view(), name='cart-detail'),
    path('cart/items/<int:pk>/', views.CartItemDetail.as_view(), name='cart-item-detail'),
]
