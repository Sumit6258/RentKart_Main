import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { InrCurrencyPipe } from '../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, InrCurrencyPipe],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
      <div class="container mx-auto px-4 py-8 max-w-7xl">
        
        <!-- Header -->
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
            <p class="text-gray-600">Manage your products and rentals</p>
          </div>
          <button routerLink="/products/create" 
                  class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 shadow-lg">
            + Add Product
          </button>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <span class="text-3xl">🎯</span>
              </div>
              <span class="text-blue-600 text-sm font-bold">Active</span>
            </div>
            <p class="text-4xl font-bold text-gray-900 mb-2">{{ stats.active_rentals }}</p>
            <p class="text-gray-600 text-sm">Active Rentals</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <span class="text-3xl">💰</span>
              </div>
              <span class="text-green-600 text-sm font-bold">Earnings</span>
            </div>
            <p class="text-4xl font-bold text-gray-900 mb-2">{{ stats.total_earnings | inrCurrency }}</p>
            <p class="text-gray-600 text-sm">Total Earnings</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <span class="text-3xl">📦</span>
              </div>
              <span class="text-purple-600 text-sm font-bold">Products</span>
            </div>
            <p class="text-4xl font-bold text-gray-900 mb-2">{{ stats.total_products }}</p>
            <p class="text-gray-600 text-sm">Listed Products</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
                <span class="text-3xl">⏳</span>
              </div>
              <span class="text-yellow-600 text-sm font-bold">Pending</span>
            </div>
            <p class="text-4xl font-bold text-gray-900 mb-2">{{ stats.pending_rentals }}</p>
            <p class="text-gray-600 text-sm">Pending Rentals</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="border-b border-gray-200">
            <nav class="flex">
              <button (click)="activeTab = 'products'"
                      [class.border-purple-600]="activeTab === 'products'"
                      [class.text-purple-600]="activeTab === 'products'"
                      class="px-6 py-4 font-semibold border-b-2 border-transparent hover:text-purple-600 transition">
                My Products
              </button>
              <button (click)="activeTab = 'rentals'"
                      [class.border-purple-600]="activeTab === 'rentals'"
                      [class.text-purple-600]="activeTab === 'rentals'"
                      class="px-6 py-4 font-semibold border-b-2 border-transparent hover:text-purple-600 transition">
                Incoming Rentals
              </button>
            </nav>
          </div>

          <!-- Products Tab -->
          <div *ngIf="activeTab === 'products'" class="p-6">
            <div *ngIf="loadingProducts" class="space-y-4">
              <div *ngFor="let i of [1,2,3]" class="animate-pulse border rounded-xl p-4">
                <div class="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>

            <div *ngIf="!loadingProducts && products.length > 0" class="space-y-4">
              <div *ngFor="let product of products" 
                   class="border-2 rounded-xl p-6 hover:border-purple-300 transition flex items-center gap-6">
                <img [src]="getProductImage(product.main_image)" 
                     [alt]="product.name"
                     class="w-24 h-24 object-cover rounded-xl shadow-md">
                
                <div class="flex-1">
                  <h3 class="font-bold text-lg mb-2">{{ product.name }}</h3>
                  <div class="flex gap-4 text-sm text-gray-600">
                    <span>💰 {{ product.daily_price | inrCurrency }}/day</span>
                    <span>📍 {{ product.city }}</span>
                    <span [class.text-green-600]="product.is_available"
                          [class.text-red-600]="!product.is_available"
                          class="font-semibold">
                      {{ product.is_available ? '✓ Available' : '✗ Unavailable' }}
                    </span>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-semibold">
                    Edit
                  </button>
                  <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold">
                    {{ product.is_available ? 'Deactivate' : 'Activate' }}
                  </button>
                </div>
              </div>
            </div>

            <div *ngIf="!loadingProducts && products.length === 0" class="text-center py-16">
              <div class="text-8xl mb-4">📦</div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">No Products Yet</h3>
              <p class="text-gray-600 mb-6">Start by adding your first product</p>
              <button routerLink="/products/create"
                      class="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-semibold shadow-lg">
                + Add Product
              </button>
            </div>
          </div>

          <!-- Rentals Tab -->
          <div *ngIf="activeTab === 'rentals'" class="p-6">
            <div *ngIf="loadingRentals" class="space-y-4">
              <div *ngFor="let i of [1,2,3]" class="animate-pulse border rounded-xl p-4">
                <div class="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>

            <div *ngIf="!loadingRentals && rentals.length > 0" class="space-y-4">
              <div *ngFor="let rental of rentals" 
                   class="border-2 rounded-xl p-6 hover:border-purple-300 transition">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="font-bold text-lg mb-2">{{ rental.product_details?.name }}</h3>
                    <p class="text-sm text-gray-600">Customer: {{ rental.customer }}</p>
                  </div>
                  <span [class]="getStatusClass(rental.status)"
                        class="px-4 py-2 rounded-full text-xs font-bold uppercase">
                    {{ rental.status }}
                  </span>
                </div>

                <div class="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p class="text-gray-500 mb-1">Start Date</p>
                    <p class="font-semibold">{{ rental.start_date | date:'shortDate' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 mb-1">End Date</p>
                    <p class="font-semibold">{{ rental.end_date | date:'shortDate' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 mb-1">Duration</p>
                    <p class="font-semibold capitalize">{{ rental.duration_type }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 mb-1">Amount</p>
                    <p class="font-semibold text-green-600">{{ rental.total_amount | inrCurrency }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="!loadingRentals && rentals.length === 0" class="text-center py-16">
              <div class="text-8xl mb-4">🛍️</div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">No Rentals Yet</h3>
              <p class="text-gray-600">Your products haven't been rented yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VendorDashboardComponent implements OnInit {
  stats = {
    active_rentals: 0,
    total_earnings: 0,
    total_products: 0,
    pending_rentals: 0
  };
  
  products: any[] = [];
  rentals: any[] = [];
  activeTab = 'products';
  loadingProducts = true;
  loadingRentals = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is vendor
    const user = this.authService.currentUser;
    if (user?.role !== 'vendor') {
      this.toastService.error('Access denied. Vendors only.');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadStats();
    this.loadProducts();
    this.loadRentals();
  }

  loadStats() {
    this.http.get(`${environment.apiUrl}/products/vendor/stats/`).subscribe({
      next: (data: any) => {
        this.stats = data;
      },
      error: (err) => console.error('Error loading stats:', err)
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
        console.error('Error loading products:', err);
        this.loadingProducts = false;
      }
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
        console.error('Error loading rentals:', err);
        this.loadingRentals = false;
      }
    });
  }

  getProductImage(imagePath: string | undefined): string {
    if (!imagePath) return '/assets/placeholder-product.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath}`;
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'pending': 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300',
      'active': 'bg-green-100 text-green-800 border-2 border-green-300',
      'completed': 'bg-gray-100 text-gray-800 border-2 border-gray-300',
      'cancelled': 'bg-red-100 text-red-800 border-2 border-red-300'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
}
