from rest_framework import serializers
from .models import Wishlist
from catalogue.serializers import ProductSerializer

class WishlistSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'product_details', 'created_at']
        extra_kwargs = {'user': {'read_only': True}}

    def create(self, validated_data):
        user = self.context['request'].user
        wishlist_item, created = Wishlist.objects.get_or_create(user=user, **validated_data)
        return wishlist_item
