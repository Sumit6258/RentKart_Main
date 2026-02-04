from django.urls import path
from . import views

urlpatterns = [
    # Public routes
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('', views.ProductListView.as_view(), name='product-list'),
    path('category/<slug:category_slug>/', views.ProductsByCategoryView.as_view(), name='products-by-category'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    
    # Vendor routes
    path('vendor/stats/', views.vendor_dashboard_stats, name='vendor-stats'),
    path('vendor/products/', views.vendor_products, name='vendor-products'),
    path('vendor/rentals/', views.vendor_rentals, name='vendor-rentals'),
]
