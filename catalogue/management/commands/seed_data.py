from django.core.management.base import BaseCommand
from catalogue.models import Category, Product
from django.core.files.base import ContentFile
import random

class Command(BaseCommand):
    help = 'Seeds the database with sample products and categories'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')
        
        # Clear existing data
        Product.objects.all().delete()
        Category.objects.all().delete()

        categories = [
            ('Electronics', ['Mobiles', 'Laptops', 'Cameras']),
            ('Fashion', ['Men', 'Women', 'Kids']),
            ('Home', ['Furniture', 'Decor', 'Kitchen']),
            ('Books', ['Fiction', 'Non-Fiction', 'Academic'])
        ]

        for cat_name, subcats in categories:
            parent = Category.objects.create(name=cat_name, slug=cat_name.lower())
            for sub in subcats:
                sub_cat = Category.objects.create(name=sub, slug=sub.lower(), parent=parent)
                
                # Create products for subcategory
                for i in range(5):
                    Product.objects.create(
                        category=sub_cat,
                        title=f'{sub} Product {i+1}',
                        description=f'This is a great product in {sub} category.',
                        price=random.randint(100, 50000),
                        stock=random.randint(10, 100)
                    )
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
