from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Customer, Address
from .serializers import CustomerSerializer, UpdateCustomerProfileSerializer, AddressSerializer


class CustomerListView(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def customer_profile_view(request):
    """Get or update customer profile"""
    try:
        customer = Customer.objects.get(user=request.user)
    except Customer.DoesNotExist:
        customer = Customer.objects.create(user=request.user)
    
    if request.method == 'GET':
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        serializer = UpdateCustomerProfileSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if 'first_name' in serializer.validated_data:
                user.first_name = serializer.validated_data['first_name']
            if 'last_name' in serializer.validated_data:
                user.last_name = serializer.validated_data['last_name']
            if 'phone' in serializer.validated_data:
                user.phone = serializer.validated_data['phone']
            user.save()
            
            if 'address' in serializer.validated_data:
                customer.address = serializer.validated_data['address']
            if 'city' in serializer.validated_data:
                customer.city = serializer.validated_data['city']
            customer.save()
            
            return Response({
                'message': 'Profile updated successfully',
                'customer': CustomerSerializer(customer).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def address_list_view(request):
    """List or create addresses"""
    try:
        customer = Customer.objects.get(user=request.user)
    except Customer.DoesNotExist:
        customer = Customer.objects.create(user=request.user)
    
    if request.method == 'GET':
        addresses = Address.objects.filter(customer=customer)
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(customer=customer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def address_detail_view(request, pk):
    """Get, update, or delete an address"""
    try:
        customer = Customer.objects.get(user=request.user)
        address = Address.objects.get(pk=pk, customer=customer)
    except (Customer.DoesNotExist, Address.DoesNotExist):
        return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = AddressSerializer(address)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        serializer = AddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        address.delete()
        return Response({'message': 'Address deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
