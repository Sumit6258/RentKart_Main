import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { InrCurrencyPipe } from '../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, InrCurrencyPipe],
  styles: [`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    @keyframes countUp {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .animate-fadeInUp {
      animation: fadeInUp 0.8s ease-out;
    }

    .animate-slideInLeft {
      animation: slideInLeft 0.8s ease-out;
    }

    .animate-pulse-slow {
      animation: pulse 3s ease-in-out infinite;
    }

    .animate-float {
      animation: float 3s ease-in-out infinite;
    }

    .animate-countUp {
      animation: countUp 0.8s ease-out;
    }

    .delay-100 {
      animation-delay: 100ms;
    }

    .delay-200 {
      animation-delay: 200ms;
    }

    .delay-300 {
      animation-delay: 300ms;
    }

    .delay-400 {
      animation-delay: 400ms;
    }

    .gradient-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .card-hover {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .card-hover:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .shimmer {
      background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <!-- Animated Background Shapes -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-200"></div>
          <div class="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-400"></div>
        </div>

        <div class="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            <!-- Live Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full mb-6 animate-fadeInUp backdrop-blur-sm">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-sm font-semibold text-green-200">🔴 LIVE - {{ liveStats.active_rentals }} Active Rentals Now</span>
            </div>

            <h1 class="text-5xl md:text-7xl font-black mb-6 animate-fadeInUp delay-100">
              Rent Anything,
              <span class="block gradient-text">Anytime, Anywhere</span>
            </h1>

            <p class="text-xl md:text-2xl text-blue-100 mb-10 animate-fadeInUp delay-200 max-w-2xl mx-auto">
              India's fastest-growing rental marketplace. From cameras to furniture, bikes to appliances - rent what you need, when you need it.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-300">
              <a routerLink="/products" 
                 class="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-2xl transform hover:scale-105">
                🔍 Browse Products
              </a>
              <a routerLink="/auth/register" 
                 class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition transform hover:scale-105">
                Get Started Free
              </a>
            </div>

            <!-- REAL-TIME Trust Indicators -->
            <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fadeInUp delay-400">
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-black mb-2 animate-countUp">{{ liveStats.total_users }}+</div>
                <div class="text-blue-200 text-sm">Happy Users</div>
              </div>
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-black mb-2 animate-countUp delay-100">{{ liveStats.total_products }}+</div>
                <div class="text-blue-200 text-sm">Products Listed</div>
              </div>
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-black mb-2 animate-countUp delay-200">{{ liveStats.total_vendors }}+</div>
                <div class="text-blue-200 text-sm">Verified Vendors</div>
              </div>
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-black mb-2 animate-countUp delay-300">{{ liveStats.active_rentals }}</div>
                <div class="text-blue-200 text-sm">Active Rentals</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Wave Divider -->
        <div class="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
                  fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </section>

      <!-- Trust Badges -->
      <section class="py-12 bg-white">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div class="flex items-center gap-3 text-gray-600">
              <svg class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="font-semibold">100% Verified Rentals</span>
            </div>
            <div class="flex items-center gap-3 text-gray-600">
              <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="font-semibold">Secure Payments</span>
            </div>
            <div class="flex items-center gap-3 text-gray-600">
              <svg class="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="font-semibold">24/7 Support</span>
            </div>
            <div class="flex items-center gap-3 text-gray-600">
              <svg class="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="font-semibold">Free Delivery & Pickup</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12 animate-fadeInUp">
            <div class="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full mb-4 font-semibold text-sm">
              🔥 HOT RENTALS
            </div>
            <h2 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Trending This Week
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Check out what's popular among our community
            </p>
          </div>

          <!-- Loading State -->
          <div *ngIf="loadingProducts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div *ngFor="let i of [1,2,3,4]" class="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div class="h-64 shimmer"></div>
              <div class="p-6">
                <div class="h-6 shimmer rounded mb-3"></div>
                <div class="h-4 shimmer rounded w-2/3"></div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div *ngIf="!loadingProducts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <a *ngFor="let product of featuredProducts; let i = index" 
               [routerLink]="['/products', product.slug]"
               class="card-hover bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-blue-300 cursor-pointer animate-fadeInUp"
               [class.delay-100]="i === 1"
               [class.delay-200]="i === 2"
               [class.delay-300]="i === 3">
              
              <div class="relative">
                <img [src]="getProductImage(product.main_image)" 
                     [alt]="product.name"
                     class="w-full h-64 object-cover">
                
                <!-- Popular Badge -->
                <div class="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                  ⭐ Popular
                </div>

                <!-- Live Status -->
                <div class="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                  <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Available
                </div>
              </div>

              <div class="p-6">
                <h3 class="font-bold text-lg mb-2 text-gray-900 line-clamp-2">{{ product.name }}</h3>
                
                <div class="flex items-center justify-between mb-4">
                  <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
                    {{ product.category_name }}
                  </span>
                  <span class="text-gray-500 text-sm flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    {{ product.city }}
                  </span>
                </div>

                <div class="flex items-end justify-between">
                  <div>
                    <p class="text-3xl font-black text-blue-600">{{ product.daily_price | inrCurrency }}</p>
                    <p class="text-xs text-gray-500">per day</p>
                  </div>
                  <button class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg">
                    Rent Now
                  </button>
                </div>
              </div>
            </a>
          </div>

          <div *ngIf="!loadingProducts && featuredProducts.length === 0" class="text-center py-20">
            <div class="text-6xl mb-4">📦</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">No Products Yet</h3>
            <p class="text-gray-600">Check back soon for exciting rental options!</p>
          </div>

          <div class="text-center mt-12 animate-fadeInUp delay-400">
            <a routerLink="/products" 
               class="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-xl transform hover:scale-105">
              View All Products →
            </a>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div class="absolute inset-0 overflow-hidden opacity-10">
          <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div class="container mx-auto px-4 relative z-10">
          <div class="text-center mb-16 animate-fadeInUp">
            <h2 class="text-4xl md:text-5xl font-black mb-4">How Rentkart Works</h2>
            <p class="text-xl text-blue-100 max-w-2xl mx-auto">
              Renting made simple in just 3 easy steps
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div class="text-center animate-fadeInUp">
              <div class="w-20 h-20 bg-white text-blue-600 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-2xl transform hover:scale-110 transition">
                1
              </div>
              <h3 class="text-2xl font-bold mb-4">🔍 Browse & Select</h3>
              <p class="text-blue-100">
                Explore thousands of products from verified vendors across India
              </p>
            </div>

            <div class="text-center animate-fadeInUp delay-200">
              <div class="w-20 h-20 bg-white text-blue-600 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-2xl transform hover:scale-110 transition">
                2
              </div>
              <h3 class="text-2xl font-bold mb-4">💳 Book & Pay</h3>
              <p class="text-blue-100">
                Choose your rental period and make secure payment online
              </p>
            </div>

            <div class="text-center animate-fadeInUp delay-400">
              <div class="w-20 h-20 bg-white text-blue-600 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-2xl transform hover:scale-110 transition">
                3
              </div>
              <h3 class="text-2xl font-bold mb-4">🚚 Get Delivered</h3>
              <p class="text-blue-100">
                Free doorstep delivery and pickup at your convenience
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12 animate-fadeInUp">
            <h2 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p class="text-xl text-gray-600">
              Explore rentals by category
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div *ngFor="let category of categories; let i = index" 
                 class="card-hover bg-white rounded-2xl p-8 text-center border-2 border-gray-100 hover:border-blue-300 cursor-pointer shadow-lg animate-fadeInUp"
                 [class.delay-100]="i === 1"
                 [class.delay-200]="i === 2"
                 [class.delay-300]="i === 3">
              <div class="text-5xl mb-4">{{ getCategoryIcon(category.name) }}</div>
              <h3 class="font-bold text-lg text-gray-900">{{ category.name }}</h3>
              <p class="text-sm text-gray-500 mt-2">{{ category.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-4xl md:text-5xl font-black mb-6 animate-fadeInUp">
            Ready to Start Renting?
          </h2>
          <p class="text-xl text-purple-100 mb-10 max-w-2xl mx-auto animate-fadeInUp delay-100">
            Join thousands of happy customers and start your rental journey today
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-200">
            <a routerLink="/auth/register" 
               class="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-purple-50 transition shadow-2xl transform hover:scale-105">
              Create Free Account
            </a>
            <a routerLink="/products" 
               class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition transform hover:scale-105">
              Browse Products
            </a>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];
  categories: any[] = [];
  loadingProducts = true;
  
  // REAL-TIME STATS from backend
  liveStats = {
    total_users: 0,
    total_products: 0,
    total_vendors: 0,
    active_rentals: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadFeaturedProducts();
    this.loadCategories();
    this.loadLiveStats();
    this.startRealTimeUpdates();
  }

  loadFeaturedProducts() {
    this.loadingProducts = true;
    this.http.get<any[]>(`${environment.apiUrl}/products/?is_featured=true`).subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 4);
        this.loadingProducts = false;
      },
      error: () => {
        this.http.get<any[]>(`${environment.apiUrl}/products/`).subscribe({
          next: (products) => {
            this.featuredProducts = products.slice(0, 4);
            this.loadingProducts = false;
          }
        });
      }
    });
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/products/categories/`).subscribe({
      next: (categories) => {
        this.categories = categories.slice(0, 4);
      },
      error: () => {
        this.categories = [
          { name: 'Electronics', description: 'Cameras, Laptops, Gaming' },
          { name: 'Furniture', description: 'Sofas, Tables, Beds' },
          { name: 'Appliances', description: 'AC, Fridge, Washing Machine' },
          { name: 'Vehicles', description: 'Bikes, Cars, Scooters' }
        ];
      }
    });
  }

  loadLiveStats() {
    this.http.get<any>(`${environment.apiUrl}/auth/public/stats/`).subscribe({
      next: (data) => {
        this.liveStats = data;
      },
      error: () => {
        // Fallback to fetching individual stats
        this.http.get<any>(`${environment.apiUrl}/auth/admin/stats/`).subscribe({
          next: (data) => {
            this.liveStats = {
              total_users: data.total_users || 0,
              total_products: data.total_products || 0,
              total_vendors: data.total_vendors || 0,
              active_rentals: data.active_rentals || 0
            };
          },
          error: () => {
            console.error('Could not load stats');
          }
        });
      }
    });
  }

  startRealTimeUpdates() {
    // Update active rentals every 10 seconds for live feel
    setInterval(() => {
      this.http.get<any>(`${environment.apiUrl}/auth/public/stats/`).subscribe({
        next: (data) => {
          this.liveStats.active_rentals = data.active_rentals;
        }
      });
    }, 10000);
  }

  getProductImage(imagePath: string | undefined): string {
    if (!imagePath) return '/assets/placeholder-product.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath}`;
  }

  getCategoryIcon(name: string): string {
    const icons: any = {
      'Electronics': '📱',
      'Furniture': '🛋️',
      'Appliances': '❄️',
      'Vehicles': '🚗',
      'Sports': '⚽',
      'Tools': '🔧',
      'Fashion': '👔',
      'Books': '📚'
    };
    return icons[name] || '📦';
  }
}
