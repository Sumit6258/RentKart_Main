import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  styles: [`
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes progressFill {
      from {
        width: 0%;
      }
      to {
        width: var(--progress-width);
      }
    }

    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }

    .progress-bar-fill {
      animation: progressFill 1s ease-out;
    }

    .stat-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .rental-card {
      transition: all 0.2s ease;
    }

    .rental-card:hover {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
  `],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div class="container mx-auto px-4 py-8 max-w-7xl">
        
        <!-- Page Header -->
        <div class="mb-8 animate-slide-in">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p class="text-gray-600">Manage your rentals and profile</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
              
              <!-- Profile Section -->
              <div class="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-center">
                <div class="relative inline-block mb-4">
                  <div class="w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border-4 border-white">
                    <img *ngIf="user?.profile_picture" 
                         [src]="getProfilePictureUrl(user.profile_picture)"
                         [alt]="user.full_name"
                         class="w-full h-full object-cover">
                    <div *ngIf="!user?.profile_picture" 
                         class="text-5xl font-bold text-blue-600">
                      {{ getUserInitial() }}
                    </div>
                  </div>
                  <div class="absolute bottom-0 right-0 w-9 h-9 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <h3 class="font-bold text-xl mb-1">{{ user?.full_name || user?.first_name || 'User' }}</h3>
                <p class="text-blue-100 text-sm mb-3">{{ user?.email }}</p>
                <span class="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/30 capitalize">
                  {{ user?.role }}
                </span>
              </div>

              <!-- Navigation -->
              <nav class="p-4 space-y-1">
                <button (click)="activeTab = 'overview'" 
                        [class.bg-blue-50]="activeTab === 'overview'"
                        [class.text-blue-600]="activeTab === 'overview'"
                        [class.border-l-4]="activeTab === 'overview'"
                        [class.border-blue-600]="activeTab === 'overview'"
                        class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center gap-3 group">
                  <span class="text-xl">📊</span>
                  <span>Overview</span>
                </button>
                
                <button (click)="activeTab = 'rentals'"
                        [class.bg-blue-50]="activeTab === 'rentals'"
                        [class.text-blue-600]="activeTab === 'rentals'"
                        [class.border-l-4]="activeTab === 'rentals'"
                        [class.border-blue-600]="activeTab === 'rentals'"
                        class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center gap-3 group">
                  <span class="text-xl">🛍️</span>
                  <span>My Rentals</span>
                  <span *ngIf="getActiveRentalsCount() > 0" 
                        class="ml-auto px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                    {{ getActiveRentalsCount() }}
                  </span>
                </button>
                
                <button (click)="activeTab = 'profile'"
                        [class.bg-blue-50]="activeTab === 'profile'"
                        [class.text-blue-600]="activeTab === 'profile'"
                        [class.border-l-4]="activeTab === 'profile'"
                        [class.border-blue-600]="activeTab === 'profile'"
                        class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center gap-3 group">
                  <span class="text-xl">👤</span>
                  <span>Profile</span>
                </button>
                
                <button (click)="activeTab = 'addresses'"
                        [class.bg-blue-50]="activeTab === 'addresses'"
                        [class.text-blue-600]="activeTab === 'addresses'"
                        [class.border-l-4]="activeTab === 'addresses'"
                        [class.border-blue-600]="activeTab === 'addresses'"
                        class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center gap-3 group">
                  <span class="text-xl">🏠</span>
                  <span>Addresses</span>
                </button>
              </nav>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-3">
            
            <!-- OVERVIEW TAB -->
            <div *ngIf="activeTab === 'overview'" class="space-y-6 animate-slide-in">
              
              <!-- Welcome Card -->
              <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
                <h2 class="text-3xl font-bold mb-2">Welcome back, {{ user?.first_name || 'User' }}! 👋</h2>
                <p class="text-blue-100">Here's what's happening with your rentals today</p>
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button (click)="filterRentals('active')" 
                        class="stat-card bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-blue-300 cursor-pointer text-left">
                  <div class="flex items-center justify-between mb-4">
                    <div class="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <span class="text-3xl">🎯</span>
                    </div>
                    <span class="text-blue-600 text-sm font-bold">Active</span>
                  </div>
                  <p class="text-5xl font-bold text-gray-900 mb-2">{{ getActiveRentalsCount() }}</p>
                  <p class="text-gray-600 text-sm font-medium">Active Rentals</p>
                </button>

                <button (click)="filterRentals('completed')"
                        class="stat-card bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-green-300 cursor-pointer text-left">
                  <div class="flex items-center justify-between mb-4">
                    <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <span class="text-3xl">✅</span>
                    </div>
                    <span class="text-green-600 text-sm font-bold">Completed</span>
                  </div>
                  <p class="text-5xl font-bold text-gray-900 mb-2">{{ getCompletedRentalsCount() }}</p>
                  <p class="text-gray-600 text-sm font-medium">Completed</p>
                </button>

                <button (click)="filterRentals('all')"
                        class="stat-card bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-purple-300 cursor-pointer text-left">
                  <div class="flex items-center justify-between mb-4">
                    <div class="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                      <span class="text-3xl">📦</span>
                    </div>
                    <span class="text-purple-600 text-sm font-bold">Total</span>
                  </div>
                  <p class="text-5xl font-bold text-gray-900 mb-2">{{ rentals.length }}</p>
                  <p class="text-gray-600 text-sm font-medium">Total Rentals</p>
                </button>
              </div>

              <!-- Upcoming Return Alert -->
              <div *ngIf="getNextReturnDate()" 
                   class="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-xl p-6 shadow-lg">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span class="text-2xl">⏰</span>
                  </div>
                  <div>
                    <p class="font-bold text-lg text-amber-900 mb-1">Upcoming Return</p>
                    <p class="text-amber-800">Your next rental is due on <strong>{{ getNextReturnDate() }}</strong></p>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="bg-white rounded-2xl shadow-xl p-6">
                <h3 class="font-bold text-xl mb-4 flex items-center gap-2">
                  <span class="text-2xl">⚡</span>
                  Quick Actions
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a routerLink="/products" 
                     class="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition border border-blue-100">
                    <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span class="text-2xl">🔍</span>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">Browse Products</p>
                      <p class="text-sm text-gray-600">Find your next rental</p>
                    </div>
                  </a>
                  <button (click)="activeTab = 'profile'"
                          class="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition border border-purple-100">
                    <div class="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <span class="text-2xl">👤</span>
                    </div>
                    <div class="text-left">
                      <p class="font-bold text-gray-900">Edit Profile</p>
                      <p class="text-sm text-gray-600">Update your information</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- MY RENTALS TAB -->
            <div *ngIf="activeTab === 'rentals'" class="bg-white rounded-2xl shadow-xl p-8 animate-slide-in">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <span class="text-4xl">🛍️</span>
                  {{ rentalFilterTitle }}
                </h2>
                <button *ngIf="rentalFilter !== 'all'" 
                        (click)="clearRentalFilter()"
                        class="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">
                  View All
                </button>
              </div>

              <!-- Loading State -->
              <div *ngIf="loadingRentals" class="space-y-4">
                <div *ngFor="let i of [1,2,3]" class="animate-pulse border-2 border-gray-100 rounded-2xl p-6">
                  <div class="flex gap-4">
                    <div class="w-24 h-24 bg-gray-200 rounded-xl"></div>
                    <div class="flex-1 space-y-3">
                      <div class="h-6 bg-gray-200 rounded w-1/2"></div>
                      <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Rentals List -->
              <div *ngIf="!loadingRentals && getFilteredRentals().length > 0" class="space-y-4">
                <div *ngFor="let rental of getFilteredRentals()" 
                     class="rental-card border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-200">
                  <div class="flex gap-6">
                    <!-- Product Image -->
                    <img [src]="productService.getImageUrl(rental.product_details?.main_image)" 
                         [alt]="rental.product_details?.name"
                         class="w-32 h-32 object-cover rounded-xl flex-shrink-0 shadow-md border border-gray-200">
                    
                    <div class="flex-1 min-w-0">
                      <!-- Product Name & Category -->
                      <div class="flex items-start justify-between mb-3">
                        <div>
                          <h3 class="font-bold text-xl text-gray-900 mb-2">{{ rental.product_details?.name }}</h3>
                          <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                            {{ rental.product_details?.category_name }}
                          </span>
                        </div>
                        <span [class]="getStatusClass(rental.status)"
                              class="px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap">
                          {{ rental.status }}
                        </span>
                      </div>
                      
                      <!-- Rental Details Grid -->
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div class="bg-gray-50 rounded-lg p-3">
                          <p class="text-xs text-gray-500 mb-1 font-semibold uppercase">Start Date</p>
                          <p class="font-bold text-gray-900">{{ rental.start_date | date:'MMM d, y' }}</p>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-3">
                          <p class="text-xs text-gray-500 mb-1 font-semibold uppercase">End Date</p>
                          <p class="font-bold text-gray-900">{{ rental.end_date | date:'MMM d, y' }}</p>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-3">
                          <p class="text-xs text-gray-500 mb-1 font-semibold uppercase">Duration</p>
                          <p class="font-bold text-gray-900 capitalize">{{ rental.duration_type }}</p>
                        </div>
                        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                          <p class="text-xs text-blue-600 mb-1 font-semibold uppercase">Amount</p>
                          <p class="font-bold text-2xl text-blue-600">₹{{ rental.total_amount }}</p>
                        </div>
                      </div>

                      <!-- Progress Bar for Active Rentals -->
                      <div *ngIf="rental.is_active && rental.days_remaining >= 0">
                        <div class="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-4 border border-gray-200">
                          <!-- Header -->
                          <div class="flex justify-between items-center mb-3">
                            <div class="flex items-center gap-2">
                              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span class="font-bold text-gray-900">Rental Progress</span>
                            </div>
                            <div class="text-right">
                              <p class="text-sm font-bold text-blue-600">{{ getRentalProgress(rental) }}% Complete</p>
                              <p class="text-xs text-gray-600">{{ rental.days_remaining }} days remaining</p>
                            </div>
                          </div>

                          <!-- Progress Bar -->
                          <div class="relative h-3 bg-white rounded-full overflow-hidden shadow-inner border border-gray-200">
                            <div class="progress-bar-fill absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                                 [style.width.%]="getRentalProgress(rental)">
                            </div>
                          </div>

                          <!-- Timeline Markers -->
                          <div class="flex justify-between items-center mt-3 text-xs">
                            <div class="flex items-center gap-2 text-gray-600">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <span class="font-semibold">{{ rental.start_date | date:'MMM d' }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-gray-600">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span class="font-semibold">{{ rental.end_date | date:'MMM d' }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div *ngIf="!loadingRentals && getFilteredRentals().length === 0" 
                   class="text-center py-20">
                <div class="text-9xl mb-6">🛍️</div>
                <h3 class="text-3xl font-bold text-gray-900 mb-3">No {{ rentalFilter !== 'all' ? rentalFilter : '' }} Rentals</h3>
                <p class="text-gray-600 text-lg mb-8">Start browsing products to create your first rental</p>
                <a routerLink="/products" 
                   class="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold shadow-lg text-lg">
                  Browse Products →
                </a>
              </div>
            </div>

            <!-- PROFILE TAB -->
            <div *ngIf="activeTab === 'profile'" class="space-y-6 animate-slide-in">
              
              <!-- Profile Picture Section -->
              <div class="bg-white rounded-2xl shadow-xl p-8">
                <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span class="text-3xl">📸</span>
                  Profile Picture
                </h2>
                
                <div class="flex flex-col md:flex-row items-center gap-8">
                  <div class="relative">
                    <div class="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-4 border-blue-200 shadow-lg">
                      <img *ngIf="user?.profile_picture" 
                           [src]="getProfilePictureUrl(user.profile_picture)"
                           [alt]="user.full_name"
                           class="w-full h-full object-cover">
                      <div *ngIf="!user?.profile_picture" 
                           class="text-6xl font-bold text-blue-600">
                        {{ getUserInitial() }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex-1">
                    <h3 class="font-bold text-xl mb-2">Upload New Picture</h3>
                    <p class="text-gray-600 mb-4">JPG, PNG or GIF. Max size of 5MB</p>
                    <div class="flex gap-3">
                      <label class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 cursor-pointer transition shadow-lg">
                        <input type="file" 
                               (change)="onFileSelected($event)" 
                               accept="image/*" 
                               class="hidden">
                        Choose Photo
                      </label>
                      <button *ngIf="user?.profile_picture" 
                              (click)="removeProfilePicture()"
                              class="px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-xl hover:bg-red-200 transition">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Profile Form -->
              <div class="bg-white rounded-2xl shadow-xl p-8">
                <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span class="text-3xl">✏️</span>
                  Edit Profile
                </h2>

                <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                      <input formControlName="first_name" type="text"
                             class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                    </div>

                    <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                      <input formControlName="last_name" type="text"
                             class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                    </div>

                    <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">Email (Read Only)</label>
                      <input [value]="user?.email" type="email" disabled
                             class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed">
                    </div>

                    <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                      <input formControlName="phone" type="tel"
                             class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                    </div>

                    <div class="md:col-span-2">
                      <label class="block text-sm font-bold text-gray-700 mb-2">Address</label>
                      <textarea formControlName="address" rows="3"
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                    </div>

                    <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">City</label>
                      <input formControlName="city" type="text"
                             class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                    </div>
                  </div>

                  <div class="mt-8 flex gap-4">
                    <button type="submit" 
                            [disabled]="profileForm.invalid || updatingProfile"
                            class="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 shadow-lg transition text-lg">
                      <span *ngIf="!updatingProfile" class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Save Changes
                      </span>
                      <span *ngIf="updatingProfile">Saving...</span>
                    </button>
                    <button type="button" (click)="loadProfile()"
                            class="px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- ADDRESSES TAB -->
            <div *ngIf="activeTab === 'addresses'" class="space-y-6 animate-slide-in">
              <div class="bg-white rounded-2xl shadow-xl p-8">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-2xl font-bold flex items-center gap-2">
                    <span class="text-3xl">🏠</span>
                    My Addresses
                  </h2>
                  <button (click)="showAddressForm = !showAddressForm"
                          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg transition">
                    + Add New Address
                  </button>
                </div>

                <!-- Address Form -->
                <div *ngIf="showAddressForm" class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <h3 class="font-bold text-lg mb-4">Add New Address</h3>
                  <form [formGroup]="addressForm" (ngSubmit)="addAddress()">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Address Line 1</label>
                        <input formControlName="address_line1" type="text"
                               class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      </div>
                      <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Address Line 2 (Optional)</label>
                        <input formControlName="address_line2" type="text"
                               class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      </div>
                      <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">City</label>
                        <input formControlName="city" type="text"
                               class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      </div>
                      <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">State</label>
                        <input formControlName="state" type="text"
                               class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      </div>
                      <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                        <input formControlName="pincode" type="text"
                               class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      </div>
                      <div class="flex items-end">
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" formControlName="is_default"
                                 class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500">
                          <span class="text-sm font-semibold text-gray-700">Set as default address</span>
                        </label>
                      </div>
                    </div>
                    <div class="flex gap-3 mt-6">
                      <button type="submit" 
                              [disabled]="addressForm.invalid || savingAddress"
                              class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-lg">
                        <span *ngIf="!savingAddress">Save Address</span>
                        <span *ngIf="savingAddress">Saving...</span>
                      </button>
                      <button type="button" (click)="showAddressForm = false"
                              class="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>

                <!-- Addresses List -->
                <div *ngIf="loadingAddresses" class="space-y-4">
                  <div *ngFor="let i of [1,2]" class="animate-pulse border-2 border-gray-200 rounded-xl p-6">
                    <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>

                <div *ngIf="!loadingAddresses && addresses.length > 0" class="space-y-4">
                  <div *ngFor="let address of addresses" 
                       class="border-2 rounded-xl p-6 hover:border-blue-300 transition"
                       [class.border-blue-500]="address.is_default"
                       [class.bg-blue-50]="address.is_default">
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <div class="flex items-center gap-3 mb-3">
                          <h3 class="font-bold text-lg">{{ address.address_line1 }}</h3>
                          <span *ngIf="address.is_default" 
                                class="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                            Default
                          </span>
                        </div>
                        <p class="text-gray-700 mb-1">{{ address.address_line2 }}</p>
                        <p class="text-gray-700">{{ address.city }}, {{ address.state }} - {{ address.pincode }}</p>
                      </div>
                      <button (click)="deleteAddress(address.id)"
                              class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div *ngIf="!loadingAddresses && addresses.length === 0 && !showAddressForm" 
                     class="text-center py-16">
                  <div class="text-8xl mb-4">🏠</div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">No Addresses Yet</h3>
                  <p class="text-gray-600 mb-6">Add your first address to start renting</p>
                  <button (click)="showAddressForm = true"
                          class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg">
                    + Add Address
                  </button>
                </div>
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
  addresses: any[] = [];
  loadingRentals = true;
  loadingAddresses = false;
  updatingProfile = false;
  savingAddress = false;
  activeTab = 'overview';
  rentalFilter: 'all' | 'active' | 'completed' = 'all';
  showAddressForm = false;
  
  profileForm: FormGroup;
  addressForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    public productService: ProductService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      phone: [''],
      address: [''],
      city: ['']
    });

    this.addressForm = this.fb.group({
      address_line1: [''],
      address_line2: [''],
      city: [''],
      state: [''],
      pincode: [''],
      is_default: [false]
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

  loadAddresses() {
    this.loadingAddresses = true;
    this.http.get<any[]>(`${environment.apiUrl}/customers/addresses/`).subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.loadingAddresses = false;
      },
      error: (err) => {
        console.error('Error loading addresses:', err);
        this.addresses = [];
        this.loadingAddresses = false;
      }
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.updatingProfile = true;
      
      this.http.patch(`${environment.apiUrl}/customers/profile/`, this.profileForm.value).subscribe({
        next: (response: any) => {
          this.toastService.success('✅ Profile updated successfully!');
          
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      this.http.post(`${environment.apiUrl}/auth/profile/picture/`, formData).subscribe({
        next: (response: any) => {
          this.toastService.success('✅ Profile picture updated!');
          this.user = response.user;
          this.authService.updateCurrentUser(response.user);
        },
        error: (err) => {
          this.toastService.error('Failed to upload picture');
        }
      });
    }
  }

  removeProfilePicture() {
    // Implementation for removing profile picture
    this.toastService.info('Feature coming soon');
  }

  addAddress() {
    if (this.addressForm.valid) {
      this.savingAddress = true;
      
      this.http.post(`${environment.apiUrl}/customers/addresses/`, this.addressForm.value).subscribe({
        next: (response) => {
          this.toastService.success('✅ Address added successfully!');
          this.loadAddresses();
          this.addressForm.reset();
          this.showAddressForm = false;
          this.savingAddress = false;
        },
        error: (err) => {
          this.toastService.error('Failed to add address');
          this.savingAddress = false;
        }
      });
    }
  }

  deleteAddress(id: string) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.http.delete(`${environment.apiUrl}/customers/addresses/${id}/`).subscribe({
        next: () => {
          this.toastService.success('Address deleted');
          this.loadAddresses();
        },
        error: (err) => {
          this.toastService.error('Failed to delete address');
        }
      });
    }
  }

  filterRentals(filter: 'all' | 'active' | 'completed') {
    this.rentalFilter = filter;
    this.activeTab = 'rentals';
  }

  clearRentalFilter() {
    this.rentalFilter = 'all';
  }

  getFilteredRentals() {
    if (this.rentalFilter === 'all') {
      return this.rentals;
    }
    return this.rentals.filter(r => r.status === this.rentalFilter);
  }

  get rentalFilterTitle(): string {
    if (this.rentalFilter === 'active') return 'Active Rentals';
    if (this.rentalFilter === 'completed') return 'Completed Rentals';
    return 'My Rentals';
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

  getProfilePictureUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    return `http://localhost:8000${path}`;
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
