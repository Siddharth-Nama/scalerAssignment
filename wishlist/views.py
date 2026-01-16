from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Wishlist
from .serializers import WishlistSerializer
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from catalogue.models import Product

class WishlistListCreate(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

class WishlistToggle(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)

        if not created:
            wishlist_item.delete()
            return Response({'status': 'removed', 'message': 'Removed from wishlist'}, status=status.HTTP_200_OK)
        
        serializer = WishlistSerializer(wishlist_item)
        return Response({'status': 'added', 'message': 'Added to wishlist', 'data': serializer.data}, status=status.HTTP_201_CREATED)
