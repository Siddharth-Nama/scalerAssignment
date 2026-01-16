from django.urls import path
from .views import WishlistListCreate, WishlistToggle

urlpatterns = [
    path('', WishlistListCreate.as_view(), name='wishlist-list-create'),
    path('toggle/<int:product_id>/', WishlistToggle.as_view(), name='wishlist-toggle'),
]
