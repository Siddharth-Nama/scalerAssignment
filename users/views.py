from rest_framework import generics
from .models import Address
from .serializers import AddressSerializer

class AddressListCreate(generics.ListCreateAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    
    # In a real app, filtering by request.user would happen here
    # def get_queryset(self):
    #     return Address.objects.filter(user=self.request.user)

class AddressDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
