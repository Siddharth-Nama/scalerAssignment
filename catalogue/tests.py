from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Category, Product

class ProductTests(APITestCase):
    def setUp(self):
        self.cat = Category.objects.create(name='Electronics', slug='electronics')
        self.product = Product.objects.create(
            category=self.cat,
            title='Test Product',
            description='Test Description',
            price=100.00,
            stock=10
        )
        self.list_url = reverse('product-list')
        self.detail_url = reverse('product-detail', args=[self.product.id])

    def test_list_products(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_filter_products(self):
        response = self.client.get(self.list_url, {'category': 'electronics'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        response = self.client.get(self.list_url, {'category': 'fashion'})
        self.assertEqual(len(response.data), 0)
    
    def test_search_products(self):
        response = self.client.get(self.list_url, {'search': 'Test'})
        self.assertEqual(len(response.data), 1)
        
        response = self.client.get(self.list_url, {'search': 'NonExistent'})
        self.assertEqual(len(response.data), 0)

    def test_retrieve_product(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Product')
