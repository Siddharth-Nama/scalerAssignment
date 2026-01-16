from rest_framework import generics, views, status
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import Cart
from django.db import transaction

class OrderListCreate(generics.ListCreateAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Order.objects.filter(user=self.request.user).order_by('-created_at')
        return Order.objects.none() # Or return all for admin? Returning none for guest security

    def post(self, request, *args, **kwargs):
        # 1. Get User
        user = None
        if request.user.is_authenticated:
            user = request.user
        else:
            # Fallback for assignment requirements ("Assuming default user logged in")
            # In real scenario, we might create a guest user or error
            from django.contrib.auth.models import User
            user = User.objects.first()
            if not user:
                user = User.objects.create_superuser('admin', 'admin@example.com', 'password')

        # 2. Get Cart
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
             return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        if not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Create Order
        address = request.data.get('address', 'Default Address') # Simplified
        
        with transaction.atomic():
            total_amount = cart.total_price()
            order = Order.objects.create(
                user=user,
                address_snapshot=address,
                total_amount=total_amount,
                status='Pending'
            )

            # 4. Move items
            for item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    price=item.product.price,
                    quantity=item.quantity
                )
            
            # 5. Clear Cart
            cart.items.all().delete()
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class OrderDetail(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    def get_queryset(self):
         if self.request.user.is_authenticated:
             return Order.objects.filter(user=self.request.user)
         # Fallback logic for testing
         return Order.objects.all()
