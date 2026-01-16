from rest_framework import generics, status, views
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from catalogue.models import Product
from django.shortcuts import get_object_or_404

class CartDetail(views.APIView):
    def get_object(self):
        # Simplification: Get first cart for testing / mock user
        # In real app: request.user.cart (or create one)
        # Using a default user for "Acting as senior engineer" doing quick verification without full auth flow UI
        # But logically:
        if self.request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=self.request.user)
            return cart
        else:
            # Create a localized cart or error. For assignment, assuming default user login.
            # We will use user_id=1 if available, or just create a cart with null user
             cart, created = Cart.objects.get_or_create(id=1) # Just reusing a cart for simplicity if needed
             return cart 

    def get(self, request):
        # Fallback logic to robustly get a cart
        if request.user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=request.user)
        else:
            # For testing without login, we rely on a cart ID or create a new one
            # To follow instructions "Assume a default user is logged in", we can mock this by trying to get user=1
            from django.contrib.auth.models import User
            user = User.objects.first()
            if not user:
                user = User.objects.create_superuser('admin', 'admin@example.com', 'password')
            cart, _ = Cart.objects.get_or_create(user=user)
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        # Get cart same way as GET
        if request.user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=request.user)
        else:
             from django.contrib.auth.models import User
             user = User.objects.first()
             if not user:
                 user = User.objects.create_superuser('admin', 'admin@example.com', 'password')
             cart, _ = Cart.objects.get_or_create(user=user)

        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        product = get_object_or_404(Product, id=product_id)
        
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()
        
        return Response(CartSerializer(cart).data)

class CartItemDetail(generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        # Handle quantity update
        return self.partial_update(request, *args, **kwargs)
