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
        return Order.objects.none()

    def post(self, request, *args, **kwargs):
        user = None
        if request.user.is_authenticated:
            user = request.user
        else:
            from django.contrib.auth.models import User
            user = User.objects.first()
            if not user:
                user = User.objects.create_superuser('admin', 'admin@example.com', 'password')

        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
             return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        if not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        address = request.data.get('address', 'Default Address')
        
        with transaction.atomic():
            total_amount = cart.total_price()
            order = Order.objects.create(
                user=user,
                address_snapshot=address,
                total_amount=total_amount,
                status='Pending'
            )

            for item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    price=item.product.price,
                    quantity=item.quantity
                )
            
            cart.items.all().delete()
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class OrderDetail(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    def get_queryset(self):
         if self.request.user.is_authenticated:
             return Order.objects.filter(user=self.request.user)
         return Order.objects.all()
