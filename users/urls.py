from django.urls import path
from . import views

urlpatterns = [
    path('addresses/', views.AddressListCreate.as_view(), name='address-list-create'),
    path('addresses/<int:pk>/', views.AddressDetail.as_view(), name='address-detail'),
]
