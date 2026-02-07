import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { InrCurrencyPipe } from '../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, InrCurrencyPipe],
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }

    .stat-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .product-card {
      transition: all 0.2s ease;
    }

    .product-card:hover {
      transform: scale(1.02);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
  `],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      
      <!-- Vendor Header -->
      <nav class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-3">
              <a routerLink="/" class="flex items-center gap-2">
                <span class="text-2xl">🏠</span>
                <span class="text-2xl font-black text-blue-600">Rentkart</span>
              </a>
              <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                VENDOR PORTAL
              </span>
            </div>
            
            <div class="flex items-center gap-4">
              <span class="text-gray-700 text-sm font-medium">👋 {{ user?.first_name || 'Vendor' }}</span>
              <button (click)="logout()"
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="container mx-auto px-4 py-8">
        
        <!-- Welcome Section -->
        <div class="mb-8 animate-fade-in">
          <h1 class="text-4xl font-black text-gray-900 mb-2">Vendor Dashboard</h1>
          <p class="text-gray-600 text-lg">Manage your products and track your rental business</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <span class="text-3xl">🎯</span>
              </div>
            </div>
            <p class="text-5xl font-black mb-2">{{ stats.active_rentals }}</p>
            <p class="text-blue-100 text-sm font-semibold">Active Rentals</p>
          </div>

          <div class="stat-card bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <span class="text-3xl">💰</span>
              </div>
            </div>
            <p class="text-5xl font-black mb-2">{{ stats.total_earnings | inrCurrency }}</p>
            <p class="text-green-100 text-sm font-semibold">Total Earnings</p>
          </div>

          <div class="stat-card bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <span class="text-3xl">📦</span>
              </div>
            </div>
            <p class="text-5xl font-black mb-2">{{ stats.total_products }}</p>
            <p class="text-purple-100 text-sm font-semibold">Listed Products</p>
          </div>

          <div class="stat-card bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <span class="text-3xl">⏳</span>
              </div>
            </div>
            <p class="text-5xl font-black mb-2">{{ stats.pending_rentals }}</p>
            <p class="text-yellow-100 text-sm font-semibold">Pending Requests</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="border-b border-gray-200">
            <nav class="flex overflow-x-auto">
              <button (click)="activeTab = 'products'"
                      [class.border-purple-600]="activeTab === 'products'"
                      [class.text-purple-600]="activeTab === 'products'"
                      [class.bg-purple-50]="activeTab === 'products'"
                      class="px-6 py-4 font-bold border-b-4 border-transparent text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition whitespace-nowrap">
                📦 My Products
              </button>
              <button (click)="activeTab = 'rentals'; loadRentals()"
                      [class.border-purple-600]="activeTab === 'rentals'"
                      [class.text-purple-600]="activeTab === 'rentals'"
                      [class.bg-purple-50]="activeTab === 'rentals'"
                      class="px-6 py-4 font-bold border-b-4 border-transparent text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition whitespace-nowrap">
                🛍️ Incoming Rentals
              </button>
              <button (click)="activeTab = 'profile'"
                      [class.border-purple-600]="activeTab === 'profile'"
                      [class.text-purple-600]="activeTab === 'profile'"
                      [class.bg-purple-50]="activeTab === 'profile'"
                      class="px-6 py-4 font-bold border-b-4 border-transparent text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition whitespace-nowrap">
                👤 Profile
              </button>
            </nav>
          </div>

          <!-- MY PRODUCTS TAB -->
          <div *ngIf="activeTab === 'products'" class="p-8">
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900">My Products</h2>
              <button (click)="showProductForm = true; editingProduct = null; productForm.reset()"
                      class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-bold shadow-lg transition">
                + Add Product
              </button>
            </div>

            <!-- Add/Edit Product Form -->
            <div *ngIf="showProductForm" class="mb-8 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 animate-fade-in">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">{{ editingProduct ? 'Edit' : 'Add New' }} Product</h3>
              <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-bold text-gray-700 mb-2">Product Name *</label>
                    <input formControlName="name" type="text" placeholder="e.g., Canon EOS R5 Camera"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                    <textarea formControlName="description" rows="4" placeholder="Describe your product..."
                              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                    <select formControlName="category"
                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <option value="">Select Category</option>
                      <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Daily Price (₹) *</label>
                    <input formControlName="daily_price" type="number" placeholder="500"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Weekly Price (₹)</label>
                    <input formControlName="weekly_price" type="number" placeholder="3000"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Monthly Price (₹)</label>
                    <input formControlName="monthly_price" type="number" placeholder="10000"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Security Deposit (₹) *</label>
                    <input formControlName="security_deposit" type="number" placeholder="5000"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Quantity Available *</label>
                    <input formControlName="quantity_available" type="number" placeholder="1"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">City *</label>
                    <input formControlName="city" type="text" placeholder="Mumbai"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">State</label>
                    <input formControlName="state" type="text" placeholder="Maharashtra"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-bold text-gray-700 mb-2">Product Image *</label>
                    <input type="file" (change)="onProductImageSelected($event)" accept="image/*"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <p class="text-xs text-gray-600 mt-2">Upload product image (JPG, PNG - Max 5MB)</p>
                  </div>

                  <div class="flex items-center gap-3">
                    <input formControlName="is_available" type="checkbox"
                           class="w-6 h-6 text-purple-600 rounded border-gray-300 focus:ring-2 focus:ring-purple-500">
                    <label class="text-sm font-bold text-gray-700">Available for Rent</label>
                  </div>
                </div>

                <div class="flex gap-4 mt-8">
                  <button type="submit" 
                          [disabled]="productForm.invalid || savingProduct"
                          class="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 font-bold shadow-lg transition">
                    <span *ngIf="!savingProduct">💾 {{ editingProduct ? 'Update' : 'Add' }} Product</span>
                    <span *ngIf="savingProduct">Saving...</span>
                  </button>
                  <button type="button" (click)="cancelProductEdit()"
                          class="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-bold transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <!-- Products Grid -->
            <div *ngIf="!loadingProducts && products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div *ngFor="let product of products" 
                   class="product-card bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <div class="relative h-48">
                  <img [src]="productService.getImageUrl(product.main_image)" 
                       [alt]="product.name"
                       class="w-full h-full object-cover">
                  <div class="absolute top-4 right-4">
                    <span [class.bg-green-500]="product.is_available"
                          [class.bg-red-500]="!product.is_available"
                          class="px-3 py-1 text-white text-xs font-bold rounded-full shadow-lg">
                      {{ product.is_available ? '✓ Available' : '✗ Unavailable' }}
                    </span>
                  </div>
                </div>
                
                <div class="p-6">
                  <h3 class="font-bold text-xl text-gray-900 mb-2 line-clamp-1">{{ product.name }}</h3>
                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
                  
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <p class="text-xs text-gray-500">Daily Rate</p>
                      <p class="text-2xl font-black text-purple-600">{{ product.daily_price | inrCurrency }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-xs text-gray-500">Stock</p>
                      <p class="text-xl font-bold text-gray-900">{{ product.quantity_available }}</p>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button (click)="editProduct(product)"
                            class="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold text-sm transition">
                      ✏️ Edit
                    </button>
                    <button (click)="toggleProductAvailability(product)"
                            class="flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition"
                            [class.bg-green-100]="!product.is_available"
                            [class.text-green-700]="!product.is_available"
                            [class.hover:bg-green-200]="!product.is_available"
                            [class.bg-yellow-100]="product.is_available"
                            [class.text-yellow-700]="product.is_available"
                            [class.hover:bg-yellow-200]="product.is_available">
                      {{ product.is_available ? '⏸️ Hide' : '▶️ Show' }}
                    </button>
                    <button (click)="deleteProduct(product.id)"
                            class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold text-sm transition">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div *ngIf="loadingProducts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div *ngFor="let i of [1,2,3]" class="animate-pulse bg-white rounded-2xl overflow-hidden shadow-lg">
                <div class="h-48 bg-gray-200"></div>
                <div class="p-6">
                  <div class="h-6 bg-gray-200 rounded mb-3"></div>
                  <div class="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="!loadingProducts && products.length === 0 && !showProductForm" 
                 class="text-center py-20">
              <div class="text-9xl mb-6">📦</div>
              <h3 class="text-3xl font-bold text-gray-900 mb-3">No Products Yet</h3>
              <p class="text-gray-600 text-lg mb-8">Start by adding your first product</p>
              <button (click)="showProductForm = true"
                      class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-bold shadow-lg text-lg">
                + Add Product
              </button>
            </div>
          </div>

          <!-- INCOMING RENTALS TAB -->
          <div *ngIf="activeTab === 'rentals'" class="p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-8">Incoming Rental Requests</h2>
            
            <div *ngIf="loadingRentals" class="space-y-4">
              <div *ngFor="let i of [1,2,3]" class="animate-pulse border rounded-2xl p-6">
                <div class="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>

            <div *ngIf="!loadingRentals && rentals.length > 0" class="space-y-4">
              <div *ngFor="let rental of rentals" 
                   class="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-purple-300 hover:shadow-lg transition">
                <div class="flex gap-6">
                  <img [src]="productService.getImageUrl(rental.product_details?.main_image)" 
                       [alt]="rental.product_details?.name"
                       class="w-24 h-24 object-cover rounded-xl shadow-md">
                  
                  <div class="flex-1">
                    <div class="flex items-start justify-between mb-3">
                      <div>
                        <h3 class="font-bold text-xl text-gray-900 mb-1">{{ rental.product_details?.name }}</h3>
                        <p class="text-gray-600 text-sm">Customer: {{ rental.customer_details?.email }}</p>
                      </div>
                      <span [class]="getStatusClass(rental.status)"
                            class="px-4 py-2 rounded-full text-xs font-bold uppercase">
                        {{ rental.status }}
                      </span>
                    </div>
                    
                    <div class="grid grid-cols-4 gap-4 mb-4">
                      <div class="bg-gray-50 rounded-lg p-3">
                        <p class="text-xs text-gray-500 mb-1 font-semibold">Duration</p>
                        <p class="font-bold text-gray-900 capitalize">{{ rental.duration_type }}</p>
                      </div>
                      <div class="bg-gray-50 rounded-lg p-3">
                        <p class="text-xs text-gray-500 mb-1 font-semibold">Start Date</p>
                        <p class="font-bold text-gray-900">{{ rental.start_date | date:'MMM d' }}</p>
                      </div>
                      <div class="bg-gray-50 rounded-lg p-3">
                        <p class="text-xs text-gray-500 mb-1 font-semibold">End Date</p>
                        <p class="font-bold text-gray-900">{{ rental.end_date | date:'MMM d' }}</p>
                      </div>
                      <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                        <p class="text-xs text-purple-600 mb-1 font-semibold">Amount</p>
                        <p class="font-bold text-xl text-purple-600">{{ rental.total_amount | inrCurrency }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="!loadingRentals && rentals.length === 0" class="text-center py-20">
              <div class="text-9xl mb-6">🛍️</div>
              <h3 class="text-3xl font-bold text-gray-900 mb-3">No Rental Requests</h3>
              <p class="text-gray-600 text-lg">Rental requests will appear here when customers rent your products</p>
            </div>
          </div>

          <!-- PROFILE TAB -->
          <div *ngIf="activeTab === 'profile'" class="p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-8">Vendor Profile</h2>
            
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
              <div class="flex items-center gap-6 mb-8">
                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-black shadow-lg">
                  {{ getUserInitial() }}
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-gray-900">{{ user?.first_name }} {{ user?.last_name }}</h3>
                  <p class="text-gray-600">{{ user?.email }}</p>
                  <span class="inline-block mt-2 px-4 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                    VENDOR
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl p-4 border border-purple-200">
                  <p class="text-sm text-gray-600 mb-1">Total Products</p>
                  <p class="text-3xl font-black text-purple-600">{{ stats.total_products }}</p>
                </div>
                <div class="bg-white rounded-xl p-4 border border-purple-200">
                  <p class="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p class="text-3xl font-black text-green-600">{{ stats.total_earnings | inrCurrency }}</p>
                </div>
                <div class="bg-white rounded-xl p-4 border border-purple-200">
                  <p class="text-sm text-gray-600 mb-1">Active Rentals</p>
                  <p class="text-3xl font-black text-blue-600">{{ stats.active_rentals }}</p>
                </div>
                <div class="bg-white rounded-xl p-4 border border-purple-200">
                  <p class="text-sm text-gray-600 mb-1">Member Since</p>
                  <p class="text-xl font-bold text-gray-900">{{ user?.date_joined | date:'MMM yyyy' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VendorDashboardComponent implements OnInit {
  user: any = null;
  activeTab = 'products';
  
  stats = {
    active_rentals: 0,
    total_earnings: 0,
    total_products: 0,
    pending_rentals: 0
  };
  
  products: any[] = [];
  rentals: any[] = [];
  categories: any[] = [];
  
  showProductForm = false;
  editingProduct: any = null;
  productForm: FormGroup;
  productImageFile: File | null = null;
  
  loadingProducts = true;
  loadingRentals = false;
  savingProduct = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    public productService: ProductService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      daily_price: [0, [Validators.required, Validators.min(1)]],
      weekly_price: [0],
      monthly_price: [0],
      security_deposit: [0, [Validators.required, Validators.min(0)]],
      quantity_available: [1, [Validators.required, Validators.min(1)]],
      city: ['', Validators.required],
      state: [''],
      is_available: [true]
    });
  }

  ngOnInit() {
    this.user = this.authService.currentUser;
    
    if (!this.user || this.user.role !== 'vendor') {
      this.toastService.error('Access denied - Vendors only');
      this.router.navigate(['/']);
      return;
    }

    this.loadAll();
  }

  loadAll() {
    this.loadStats();
    this.loadProducts();
    this.loadCategories();
  }

  loadStats() {
    this.http.get(`${environment.apiUrl}/products/vendor/stats/`).subscribe({
      next: (data: any) => this.stats = data,
      error: (err) => console.error('Error:', err)
    });
  }

  loadProducts() {
    this.loadingProducts = true;
    this.http.get<any[]>(`${environment.apiUrl}/products/vendor/products/`).subscribe({
      next: (products) => {
        this.products = products;
        this.loadingProducts = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.loadingProducts = false;
      }
    });
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/products/categories/`).subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error('Error:', err)
    });
  }

  loadRentals() {
    this.loadingRentals = true;
    this.http.get<any[]>(`${environment.apiUrl}/products/vendor/rentals/`).subscribe({
      next: (rentals) => {
        this.rentals = rentals;
        this.loadingRentals = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.loadingRentals = false;
      }
    });
  }

  onProductImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('Image size must be less than 5MB');
        return;
      }
      this.productImageFile = file;
    }
  }

  editProduct(product: any) {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      category: product.category,
      daily_price: product.daily_price,
      weekly_price: product.weekly_price,
      monthly_price: product.monthly_price,
      security_deposit: product.security_deposit,
      quantity_available: product.quantity_available,
      city: product.city,
      state: product.state,
      is_available: product.is_available
    });
    this.showProductForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  saveProduct() {
  if (this.productForm.valid) {
    this.savingProduct = true;
    
    const formData = new FormData();
    
    Object.keys(this.productForm.value).forEach(key => {
      if (this.productForm.value[key] !== null && this.productForm.value[key] !== '') {
        formData.append(key, this.productForm.value[key]);
      }
    });

    if (this.productImageFile) {
      formData.append('main_image', this.productImageFile);
    }

    // Don't append vendor - backend will set it automatically
    // formData.append('vendor', this.user.id); // REMOVE THIS LINE

    const url = this.editingProduct
      ? `${environment.apiUrl}/products/vendor/products/${this.editingProduct.id}/`
      : `${environment.apiUrl}/products/vendor/products/create/`;
    
    const method = this.editingProduct ? 'patch' : 'post';

    this.http[method](url, formData).subscribe({
      next: () => {
        this.toastService.success(this.editingProduct ? '✅ Product updated!' : '✅ Product added!');
        this.cancelProductEdit();
        this.loadProducts();
        this.loadStats();
      },
      error: (err) => {
        console.error('Error:', err);
        this.toastService.error(err.error?.error || 'Failed to save product');
        this.savingProduct = false;
      }
    });
  }
}

  cancelProductEdit() {
    this.showProductForm = false;
    this.editingProduct = null;
    this.productForm.reset({ is_available: true });
    this.productImageFile = null;
    this.savingProduct = false;
  }

  toggleProductAvailability(product: any) {
  this.http.patch(`${environment.apiUrl}/products/vendor/products/${product.id}/`, {
    is_available: !product.is_available
  }).subscribe({
    next: () => {
      this.toastService.success(product.is_available ? 'Product hidden' : 'Product visible');
      this.loadProducts();
    },
    error: () => this.toastService.error('Failed to update')
  });
}

  deleteProduct(id: string) {
  if (confirm('Delete this product? This action cannot be undone.')) {
    this.http.delete(`${environment.apiUrl}/products/vendor/products/${id}/`).subscribe({
      next: () => {
        this.toastService.success('Product deleted');
        this.loadProducts();
        this.loadStats();
      },
      error: () => this.toastService.error('Failed to delete')
    });
  }
}

  getStatusClass(status: string): string {
    const classes: any = {
      'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      'active': 'bg-green-100 text-green-800 border border-green-300',
      'completed': 'bg-gray-100 text-gray-800 border border-gray-300',
      'cancelled': 'bg-red-100 text-red-800 border border-red-300'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getUserInitial(): string {
    if (this.user?.first_name) {
      return this.user.first_name.charAt(0).toUpperCase();
    }
    return 'V';
  }

  logout() {
    this.authService.logout();
    this.toastService.success('Logged out');
    this.router.navigate(['/']);
  }
}