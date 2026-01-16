from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from catalogue.models import Category, Product
from cart.models import Cart, CartItem
from .models import Order
from django.contrib.auth.models import User

class OrderTests(APITestCase):
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
        self.cart = Cart.objects.create(user=self.user)
        self.cart_item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)
        self.order_url = reverse('order-list-create')

    def test_place_order(self):
        data = {'address': '123 Test St, City'}
        response = self.client.post(self.order_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(Order.objects.first().total_amount, 200.00)
        self.assertEqual(CartItem.objects.count(), 0) # Cart should be empty

    def test_order_history(self):
        # Create an order first
        Order.objects.create(user=self.user, address_snapshot='Test', total_amount=50.0)
        
        response = self.client.get(self.order_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
