from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from catalogue.models import Category, Product
from .models import Cart, CartItem
from django.contrib.auth.models import User

class CartTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.force_authenticate(user=self.user)
        self.cat = Category.objects.create(name='Electronics', slug='electronics')
        self.product = Product.objects.create(
            category=self.cat,
            title='Test Product',
            description='Test Description',
            price=100.00,
            stock=10
        )
        self.cart_url = reverse('cart-detail')

    def test_get_cart_empty(self):
        response = self.client.get(self.cart_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 0)

    def test_add_to_cart(self):
        data = {'product_id': self.product.id, 'quantity': 2}
        response = self.client.post(self.cart_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['quantity'], 2)

    def test_update_quantity(self):
        # Add item first
        cart = Cart.objects.create(user=self.user)
        cart_item = CartItem.objects.create(cart=cart, product=self.product, quantity=1)
        
        url = reverse('cart-item-detail', args=[cart_item.id])
        data = {'quantity': 5}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['quantity'], 5)

    def test_remove_item(self):
        cart = Cart.objects.create(user=self.user)
        cart_item = CartItem.objects.create(cart=cart, product=self.product, quantity=1)
        
        url = reverse('cart-item-detail', args=[cart_item.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CartItem.objects.count(), 0)
