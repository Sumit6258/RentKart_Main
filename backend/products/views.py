from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer


class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'display_order', 'created_at']
    ordering = ['display_order', 'name']


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'


class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'city', 'is_featured']
    search_fields = ['name', 'description', 'city']
    ordering_fields = ['daily_price', 'created_at', 'view_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProductListSerializer
        return ProductDetailSerializer


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ProductsByCategoryView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        return Product.objects.filter(
            category__slug=category_slug,
            is_active=True
        )


# Vendor Dashboard Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_dashboard_stats(request):
    """Get vendor dashboard statistics"""
    if request.user.role != 'vendor':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    from subscriptions.models import Subscription
    from payments.models import Payment
    
    products = Product.objects.filter(vendor=request.user)
    subscriptions = Subscription.objects.filter(product__in=products)
    
    active_rentals = subscriptions.filter(status='active').count()
    total_products = products.count()
    
    payments = Payment.objects.filter(
        subscription__in=subscriptions,
        status='success'
    )
    total_earnings = sum(float(p.amount) for p in payments)
    
    return Response({
        'active_rentals': active_rentals,
        'total_products': total_products,
        'total_earnings': total_earnings,
        'pending_rentals': subscriptions.filter(status='pending').count(),
        'completed_rentals': subscriptions.filter(status='completed').count()
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_products(request):
    """Get vendor's products"""
    if request.user.role != 'vendor':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    products = Product.objects.filter(vendor=request.user)
    serializer = ProductDetailSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_rentals(request):
    """Get rentals for vendor's products"""
    if request.user.role != 'vendor':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    from subscriptions.models import Subscription
    from subscriptions.serializers import SubscriptionSerializer
    
    products = Product.objects.filter(vendor=request.user)
    subscriptions = Subscription.objects.filter(product__in=products)
    
    serializer = SubscriptionSerializer(subscriptions, many=True)
    return Response(serializer.data)


# ADMIN CRUD OPERATIONS
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def admin_categories_crud(request):
    """Admin: List all categories or create new"""
    if not (request.user.is_superuser or request.user.role == 'admin'):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_category_detail(request, category_id):
    """Admin: Get, update, or delete category"""
    if not (request.user.is_superuser or request.user.role == 'admin'):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        category.delete()
        return Response({'message': 'Category deleted'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_product_action(request, product_id):
    """Admin: Update or delete product"""
    if not (request.user.is_superuser or request.user.role == 'admin'):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PATCH':
        serializer = ProductDetailSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        product.delete()
        return Response({'message': 'Product deleted'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_rental_action(request, rental_id):
    """Admin: Update rental status"""
    if not (request.user.is_superuser or request.user.role == 'admin'):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    from subscriptions.models import Subscription
    from subscriptions.serializers import SubscriptionSerializer
    
    try:
        rental = Subscription.objects.get(id=rental_id)
    except Subscription.DoesNotExist:
        return Response({'error': 'Rental not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = SubscriptionSerializer(rental, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
