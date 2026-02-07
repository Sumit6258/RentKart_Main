import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <!-- Loading State -->
      <div *ngIf="loading" class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="animate-pulse">
            <!-- Breadcrumb skeleton -->
            <div class="h-4 bg-gray-200 rounded w-64 mb-6"></div>
            
            <div class="bg-white rounded-2xl shadow-xl p-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Image skeleton -->
                <div class="aspect-square bg-gray-200 rounded-xl"></div>
                
                <!-- Details skeleton -->
                <div class="space-y-4">
                  <div class="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div class="h-10 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center py-20">
          <div class="text-8xl mb-6">😞</div>
          <h2 class="text-3xl font-bold text-gray-900 mb-3">Product Not Found</h2>
          <p class="text-gray-600 mb-8 text-lg">{{ error }}</p>
          <a routerLink="/products" 
             class="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg">
            ← Browse All Products
          </a>
        </div>
      </div>

      <!-- Product Content -->
      <div *ngIf="product && !loading" class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- Breadcrumb -->
          <nav class="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <a routerLink="/" class="hover:text-blue-600 transition">Home</a>
            <span>›</span>
            <a routerLink="/products" class="hover:text-blue-600 transition">Products</a>
            <span>›</span>
            <a *ngIf="product.category_slug" 
               [routerLink]="['/products']" 
               [queryParams]="{category: product.category_slug}"
               class="hover:text-blue-600 transition">
              {{ product.category_name }}
            </a>
            <span>›</span>
            <span class="text-gray-900 font-medium">{{ product.name }}</span>
          </nav>

          <!-- Main Product Card -->
          <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              <!-- Left: Image Section -->
              <div class="bg-gray-50 p-8">
                <div class="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg mb-4 flex items-center justify-center border border-gray-200">
                  <img *ngIf="product.main_image" 
                       [src]="getProductImage(product.main_image)" 
                       [alt]="product.name"
                       class="w-full h-full object-contain"
                       (error)="onImageError($event)">
                  <div *ngIf="!product.main_image" class="text-9xl opacity-20">📦</div>
                </div>
                
                <!-- Thumbnail gallery placeholder -->
                <div class="grid grid-cols-4 gap-3">
                  <div *ngFor="let i of [1,2,3,4]" 
                       class="aspect-square bg-gray-200 rounded-lg border-2 border-transparent hover:border-blue-500 cursor-pointer transition">
                  </div>
                </div>
              </div>

              <!-- Right: Details Section -->
              <div class="p-8 flex flex-col">
                
                <!-- Category Badge -->
                <div class="mb-4">
                  <span class="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-bold rounded-full border border-blue-200">
                    📦 {{ product.category_name || 'Uncategorized' }}
                  </span>
                </div>

                <!-- Product Name -->
                <h1 class="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {{ product.name }}
                </h1>

                <!-- Meta Info -->
                <div class="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
                  <span class="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="font-medium">{{ product.city }}{{ product.state ? ', ' + product.state : '' }}</span>
                  </span>
                  <span class="text-gray-400">|</span>
                  <span class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>by <strong>{{ product.vendor_name || 'Vendor' }}</strong></span>
                  </span>
                </div>

                <!-- Pricing Card -->
                <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-blue-100">
                  <h3 class="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                    <span class="text-2xl">💰</span>
                    Rental Pricing
                  </h3>
                  <div class="grid grid-cols-3 gap-4 mb-4">
                    <div class="text-center bg-white rounded-xl p-4 shadow-sm">
                      <p class="text-xs text-gray-500 mb-1 font-semibold uppercase">Daily</p>
                      <p class="text-3xl font-bold text-blue-600">₹{{ product.daily_price }}</p>
                    </div>
                    <div class="text-center bg-white rounded-xl p-4 shadow-sm" *ngIf="product.weekly_price">
                      <p class="text-xs text-gray-500 mb-1 font-semibold uppercase">Weekly</p>
                      <p class="text-3xl font-bold text-blue-600">₹{{ product.weekly_price }}</p>
                      <p class="text-xs text-green-600 font-bold mt-1">Save 10%</p>
                    </div>
                    <div class="text-center bg-white rounded-xl p-4 shadow-sm" *ngIf="product.monthly_price">
                      <p class="text-xs text-gray-500 mb-1 font-semibold uppercase">Monthly</p>
                      <p class="text-3xl font-bold text-blue-600">₹{{ product.monthly_price }}</p>
                      <p class="text-xs text-green-600 font-bold mt-1">Save 20%</p>
                    </div>
                  </div>
                  
                  <div *ngIf="product.security_deposit && product.security_deposit > 0" 
                       class="pt-4 border-t-2 border-blue-200">
                    <div class="flex justify-between items-center bg-white rounded-lg p-3">
                      <span class="text-sm font-semibold text-gray-700">🔒 Security Deposit:</span>
                      <span class="text-lg font-bold text-gray-900">₹{{ product.security_deposit }}</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-2 text-center">
                      ✓ 100% Refundable after return in original condition
                    </p>
                  </div>
                </div>

                <!-- Availability -->
                <div class="mb-6">
                  <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 border-2"
                       [class.border-green-300]="product.is_available"
                       [class.border-red-300]="!product.is_available">
                    <div class="flex items-center gap-3">
                      <span *ngIf="product.is_available" 
                            class="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold text-sm">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        Available Now
                      </span>
                      <span *ngIf="!product.is_available" 
                            class="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg font-bold text-sm">
                        ✗ Currently Unavailable
                      </span>
                    </div>
                    <span class="text-sm font-semibold text-gray-700">
                      {{ product.available_quantity || 0 }} of {{ product.quantity || 0 }} available
                    </span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3 mb-8">
                  <button (click)="rentNow()" 
                          [disabled]="!product.is_available"
                          class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg">
                    🛒 Rent This Product Now
                  </button>
                  <button class="w-full py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition">
                    💬 Contact Vendor
                  </button>
                </div>

                <!-- Description -->
                <div class="border-t-2 pt-6">
                  <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                    <span class="text-2xl">📋</span>
                    Product Description
                  </h3>
                  <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                    <p class="whitespace-pre-line">{{ product.description || 'No description available for this product.' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Similar Products -->
          <div *ngIf="similarProducts.length > 0" class="mt-16">
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900">Similar Products</h2>
              <a *ngIf="product.category_slug" 
                 [routerLink]="['/products']" 
                 [queryParams]="{category: product.category_slug}"
                 class="text-blue-600 hover:text-blue-700 font-semibold">
                View All in {{ product.category_name }} →
              </a>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div *ngFor="let similar of similarProducts" 
                   (click)="viewProduct(similar.slug)"
                   class="bg-white rounded-xl overflow-hidden shadow hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 border border-gray-100">
                <div class="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img [src]="productService.getImageUrl(similar.main_image)" 
                       [alt]="similar.name"
                       class="w-full h-full object-cover"
                       (error)="onImageError($event)">
                </div>
                <div class="p-4">
                  <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{{ similar.name }}</h3>
                  <p class="text-sm text-gray-600 mb-2">{{ similar.city }}</p>
                  <p class="text-2xl font-bold text-blue-600">₹{{ similar.daily_price }}<span class="text-sm font-normal text-gray-500">/day</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: any = null;
  similarProducts: any[] = [];
  loading = true;
  error = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadProduct(slug);
      } else {
        this.error = 'Invalid product URL';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(slug: string) {
    this.loading = true;
    this.error = '';
    
    this.productService.getProductDetail(slug).subscribe({
      next: (product) => {
        console.log('Product loaded:', product);
        this.product = product;
        this.loading = false;
        
        // Load similar products
        if (product.category) {
          this.loadSimilarProducts(product.category);
        }
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error = 'Product not found or unavailable';
        this.loading = false;
        this.toastService.error('Failed to load product');
      }
    });
  }

  loadSimilarProducts(categoryId: string) {
    this.productService.getProducts({ category: categoryId }).subscribe({
      next: (products) => {
        this.similarProducts = products
          .filter(p => p.id !== this.product?.id)
          .slice(0, 4);
      },
      error: (err) => {
        console.error('Error loading similar products:', err);
      }
    });
  }

  getProductImage(imagePath: string | undefined): string {
    return this.productService.getImageUrl(imagePath);
  }

  rentNow() {
    if (!this.authService.isLoggedIn) {
      this.toastService.info('Please login to rent this product');
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: `/products/${this.product.slug}` }
      });
      return;
    }

    if (!this.product.is_available) {
      this.toastService.warning('This product is currently unavailable');
      return;
    }

    // Navigate to rent page
    this.router.navigate(['/rent', this.product.slug]);
  }

  viewProduct(slug: string) {
    this.router.navigate(['/products', slug]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onImageError(event: any) {
    event.target.src = '/assets/placeholder-product.png';
  }
}