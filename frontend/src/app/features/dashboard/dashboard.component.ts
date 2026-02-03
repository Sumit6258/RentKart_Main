import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold mb-8">My Dashboard</h1>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div class="text-center mb-6">
                <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-lg">
                  {{ getUserInitial() }}
                </div>
                <h3 class="font-bold text-xl">{{ user?.full_name || user?.first_name || 'User' }}</h3>
                <p class="text-sm text-gray-600">{{ user?.email }}</p>
                <span class="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full capitalize">
                  {{ user?.role }}
                </span>
              </div>

              <nav class="space-y-2">
                <button (click)="activeTab = 'overview'" 
                        [class.bg-blue-50]="activeTab === 'overview'"
                        [class.text-blue-600]="activeTab === 'overview'"
                        class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
                  📊 Overview
                </button>
                <button (click)="activeTab = 'rentals'"
                        [class.bg-blue-50]="activeTab === 'rentals'"
                        [class.text-blue-600]="activeTab === 'rentals'"
                        class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
                  🛍️ My Rentals
                </button>
                <button (click)="activeTab = 'profile'"
                        [class.bg-blue-50]="activeTab === 'profile'"
                        [class.text-blue-600]="activeTab === 'profile'"
                        class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
                  👤 Profile
                </button>
                <button (click)="activeTab = 'addresses'"
                        [class.bg-blue-50]="activeTab === 'addresses'"
                        [class.text-blue-600]="activeTab === 'addresses'"
                        class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
                  🏠 Addresses
                </button>
              </nav>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-3">
            <!-- Overview Tab -->
            <div *ngIf="activeTab === 'overview'" class="space-y-6">
              <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-2xl font-bold mb-6">Welcome back, {{ user?.first_name || 'User' }}! 👋</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <p class="text-blue-600 text-sm font-semibold mb-2">Active Rentals</p>
                    <p class="text-4xl font-bold text-blue-900">{{ getActiveRentalsCount() }}</p>
                  </div>
                  <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <p class="text-green-600 text-sm font-semibold mb-2">Completed</p>
                    <p class="text-4xl font-bold text-green-900">{{ getCompletedRentalsCount() }}</p>
                  </div>
                  <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <p class="text-purple-600 text-sm font-semibold mb-2">Total Rentals</p>
                    <p class="text-4xl font-bold text-purple-900">{{ rentals.length }}</p>
                  </div>
                </div>

                <div *ngIf="getNextReturnDate()" class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p class="text-sm font-semibold text-yellow-800 mb-1">Upcoming Return</p>
                  <p class="text-yellow-900">{{ getNextReturnDate() }}</p>
                </div>
              </div>
            </div>

            <!-- My Rentals Tab -->
            <div *ngIf="activeTab === 'rentals'" class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-2xl font-bold mb-6">My Rentals</h2>

              <div *ngIf="loadingRentals" class="space-y-4">
                <div *ngFor="let i of [1,2,3]" class="animate-pulse border rounded-lg p-6">
                  <div class="flex gap-4">
                    <div class="w-24 h-24 bg-gray-200 rounded-lg"></div>
                    <div class="flex-1">
                      <div class="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="!loadingRentals && rentals.length > 0" class="space-y-4">
                <div *ngFor="let rental of rentals" 
                     class="border-2 rounded-xl p-6 hover:shadow-lg transition">
                  <div class="flex gap-4">
                    <img [src]="productService.getImageUrl(rental.product_details?.main_image)" 
                         [alt]="rental.product_details?.name"
                         class="w-24 h-24 object-cover rounded-lg flex-shrink-0">
                    
                    <div class="flex-1 min-w-0">
                      <h3 class="font-bold text-lg mb-2 truncate">{{ rental.product_details?.name }}</h3>
                      
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                        <div>
                          <p class="text-gray-500 text-xs">Start Date</p>
                          <p class="font-semibold">{{ rental.start_date | date:'shortDate' }}</p>
                        </div>
                        <div>
                          <p class="text-gray-500 text-xs">End Date</p>
                          <p class="font-semibold">{{ rental.end_date | date:'shortDate' }}</p>
                        </div>
                        <div>
                          <p class="text-gray-500 text-xs">Duration</p>
                          <p class="font-semibold capitalize">{{ rental.duration_type }}</p>
                        </div>
                        <div>
                          <p class="text-gray-500 text-xs">Amount</p>
                          <p class="font-semibold text-blue-600">₹{{ rental.total_amount }}</p>
                        </div>
                      </div>

                      <div class="flex flex-wrap items-center gap-3">
                        <span [class]="getStatusClass(rental.status)"
                              class="px-3 py-1 rounded-full text-xs font-bold uppercase">
                          {{ rental.status }}
                        </span>
                        <span *ngIf="rental.days_remaining > 0" 
                              class="text-sm font-medium text-gray-700">
                          🕐 {{ rental.days_remaining }} days remaining
                        </span>
                        <span *ngIf="rental.days_remaining === 0 && rental.status === 'active'" 
                              class="text-sm font-medium text-red-600">
                          ⚠️ Due today
                        </span>
                      </div>

                      <div *ngIf="rental.is_active && rental.days_remaining > 0" class="mt-4">
                        <div class="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{{ getRentalProgress(rental) }}%</span>
                        </div>
                        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div class="h-full bg-blue-600 transition-all rounded-full"
                               [style.width.%]="getRentalProgress(rental)"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="!loadingRentals && rentals.length === 0" 
                   class="text-center py-16">
                <div class="text-8xl mb-4">🛍️</div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">No Rentals Yet</h3>
                <p class="text-gray-600 mb-6">Start browsing products to create your first rental</p>
                <a routerLink="/products" 
                   class="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg">
                  Browse Products
                </a>
              </div>
            </div>

            <!-- Profile Tab -->
            <div *ngIf="activeTab === 'profile'" class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-2xl font-bold mb-6">Edit Profile</h2>

              <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input formControlName="first_name" type="text"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input formControlName="last_name" type="text"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Email (Read Only)</label>
                    <input [value]="user?.email" type="email" disabled
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input formControlName="phone" type="tel"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <textarea formControlName="address" rows="3"
                              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input formControlName="city" type="text"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>
                </div>

                <div class="mt-8 flex gap-4">
                  <button type="submit" 
                          [disabled]="profileForm.invalid || updatingProfile"
                          class="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg">
                    <span *ngIf="!updatingProfile">💾 Save Changes</span>
                    <span *ngIf="updatingProfile">Saving...</span>
                  </button>
                  <button type="button" (click)="loadProfile()"
                          class="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <!-- Addresses Tab -->
            <div *ngIf="activeTab === 'addresses'" class="bg-white rounded-xl shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">My Addresses</h2>
                <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow">
                  + Add Address
                </button>
              </div>

              <div class="text-center py-16 text-gray-500">
                <div class="text-6xl mb-4">🏠</div>
                <p class="text-lg">Address management coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user: any = null;
  rentals: any[] = [];
  loadingRentals = true;
  updatingProfile = false;
  activeTab = 'overview';
  
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    public productService: ProductService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {
    this.profileForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      phone: [''],
      address: [''],
      city: ['']
    });
  }

  ngOnInit() {
    this.user = this.authService.currentUser;
    this.loadProfile();
    this.loadRentals();
    
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }

  loadProfile() {
    this.http.get(`${environment.apiUrl}/customers/profile/`).subscribe({
      next: (response: any) => {
        const user = response.user_details || this.user;
        this.profileForm.patchValue({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          phone: user.phone || '',
          address: response.address || '',
          city: response.city || ''
        });
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.updatingProfile = true;
      
      this.http.patch(`${environment.apiUrl}/customers/profile/`, this.profileForm.value).subscribe({
        next: (response: any) => {
          this.toastService.success('Profile updated successfully!');
          
          // Update user in auth service
          const updatedUser = {
            ...this.user,
            first_name: this.profileForm.value.first_name,
            last_name: this.profileForm.value.last_name,
            phone: this.profileForm.value.phone,
            full_name: `${this.profileForm.value.first_name} ${this.profileForm.value.last_name}`.trim()
          };
          
          this.authService.updateCurrentUser(updatedUser);
          this.user = updatedUser;
          this.updatingProfile = false;
        },
        error: (err) => {
          this.toastService.error('Failed to update profile');
          this.updatingProfile = false;
        }
      });
    }
  }

  loadRentals() {
    this.loadingRentals = true;
    this.http.get<any[]>(`${environment.apiUrl}/subscriptions/`).subscribe({
      next: (rentals) => {
        this.rentals = rentals;
        this.loadingRentals = false;
      },
      error: (err) => {
        console.error('Error loading rentals:', err);
        this.rentals = [];
        this.loadingRentals = false;
      }
    });
  }

  getUserInitial(): string {
    if (this.user?.first_name) {
      return this.user.first_name.charAt(0).toUpperCase();
    }
    if (this.user?.email) {
      return this.user.email.charAt(0).toUpperCase();
    }
    return 'U';
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

  getRentalProgress(rental: any): number {
    const start = new Date(rental.start_date).getTime();
    const end = new Date(rental.end_date).getTime();
    const now = new Date().getTime();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  }

  getActiveRentalsCount(): number {
    return this.rentals.filter(r => r.status === 'active').length;
  }

  getCompletedRentalsCount(): number {
    return this.rentals.filter(r => r.status === 'completed').length;
  }

  getNextReturnDate(): string | null {
    const activeRentals = this.rentals
      .filter(r => r.status === 'active' && r.days_remaining > 0)
      .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
    
    if (activeRentals.length > 0) {
      return new Date(activeRentals[0].end_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return null;
  }
}
