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
    
    # Admin CRUD routes
    path('admin/categories/', views.admin_categories_crud, name='admin-categories-crud'),
    path('admin/categories/<uuid:category_id>/', views.admin_category_detail, name='admin-category-detail'),
    path('admin/products/create/', views.admin_create_product, name='admin-create-product'),
    path('admin/products/<uuid:product_id>/', views.admin_product_detail, name='admin-product-detail'),
    path('admin/rentals/<uuid:rental_id>/', views.admin_rental_action, name='admin-rental-action'),
]
