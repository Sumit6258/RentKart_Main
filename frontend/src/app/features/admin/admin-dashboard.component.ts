import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { InrCurrencyPipe } from '../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, InrCurrencyPipe, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-900">
      <!-- Admin Header -->
      <nav class="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-3">
              <div class="text-2xl">🔐</div>
              <h1 class="text-xl font-bold text-white">Rentkart Admin Panel</h1>
            </div>
            
            <div class="flex items-center gap-4">
              <span class="text-gray-400 text-sm">👤 {{ user?.email }}</span>
              <button (click)="logout()"
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="container mx-auto px-4 py-8">
        
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div class="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-xl">👥</span>
              </div>
            </div>
            <p class="text-2xl font-bold text-white mb-1">{{ stats.total_users }}</p>
            <p class="text-gray-400 text-xs">Total Users</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span class="text-xl">🛒</span>
              </div>
            </div>
            <p class="text-2xl font-bold text-white mb-1">{{ stats.total_customers }}</p>
            <p class="text-gray-400 text-xs">Customers</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-xl">🏪</span>
              </div>
            </div>
            <p class="text-2xl font-bold text-white mb-1">{{ stats.total_vendors }}</p>
            <p class="text-gray-400 text-xs">Vendors</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                <span class="text-xl">📦</span>
              </div>
            </div>
            <p class="text-2xl font-bold text-white mb-1">{{ stats.total_products }}</p>
            <p class="text-gray-400 text-xs">Products</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-xl">🎯</span>
              </div>
            </div>
            <p class="text-2xl font-bold text-white mb-1">{{ stats.active_rentals }}</p>
            <p class="text-gray-400 text-xs">Active Rentals</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span class="text-xl">💰</span>
              </div>
            </div>
            <p class="text-2xl font-bold text-white mb-1">{{ stats.monthly_revenue | inrCurrency }}</p>
            <p class="text-gray-400 text-xs">Monthly Revenue</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div class="border-b border-gray-700">
            <nav class="flex overflow-x-auto">
              <button (click)="activeTab = 'users'"
                      [class.border-red-500]="activeTab === 'users'"
                      [class.text-white]="activeTab === 'users'"
                      class="px-6 py-3 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap">
                👥 Users
              </button>
              <button (click)="activeTab = 'categories'; loadCategories()"
                      [class.border-red-500]="activeTab === 'categories'"
                      [class.text-white]="activeTab === 'categories'"
                      class="px-6 py-3 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap">
                📁 Categories
              </button>
              <button (click)="activeTab = 'products'; loadProducts()"
                      [class.border-red-500]="activeTab === 'products'"
                      [class.text-white]="activeTab === 'products'"
                      class="px-6 py-3 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap">
                📦 Products
              </button>
              <button (click)="activeTab = 'rentals'"
                      [class.border-red-500]="activeTab === 'rentals'"
                      [class.text-white]="activeTab === 'rentals'"
                      class="px-6 py-3 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap">
                🛍️ Rentals
              </button>
              <button (click)="activeTab = 'payments'"
                      [class.border-red-500]="activeTab === 'payments'"
                      [class.text-white]="activeTab === 'payments'"
                      class="px-6 py-3 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition whitespace-nowrap">
                💳 Payments
              </button>
            </nav>
          </div>

          <!-- Users Tab -->
          <div *ngIf="activeTab === 'users'" class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-white">User Management</h2>
              <div class="flex gap-2">
                <button (click)="filterUsers('all')"
                        [class.bg-red-600]="userFilter === 'all'"
                        class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm">
                  All
                </button>
                <button (click)="filterUsers('customer')"
                        [class.bg-red-600]="userFilter === 'customer'"
                        class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm">
                  Customers
                </button>
                <button (click)="filterUsers('vendor')"
                        [class.bg-red-600]="userFilter === 'vendor'"
                        class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm">
                  Vendors
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-700">
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Name</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Role</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Joined</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of filteredUsers" class="border-b border-gray-700 hover:bg-gray-700/50 transition">
                    <td class="py-3 px-4 text-white">{{ user.email }}</td>
                    <td class="py-3 px-4 text-white">{{ user.full_name || 'N/A' }}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-1 rounded-full text-xs font-bold capitalize"
                            [class.bg-blue-600]="user.role === 'customer'"
                            [class.bg-purple-600]="user.role === 'vendor'"
                            [class.bg-red-600]="user.role === 'admin'"
                            class="text-white">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-1 rounded-full text-xs font-bold"
                            [class.bg-green-600]="user.is_active"
                            [class.bg-red-600]="!user.is_active"
                            class="text-white">
                        {{ user.is_active ? 'Active' : 'Blocked' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-gray-400">{{ user.date_joined | date:'shortDate' }}</td>
                    <td class="py-3 px-4">
                      <button (click)="toggleUser(user)"
                              [class.bg-red-600]="user.is_active"
                              [class.hover:bg-red-700]="user.is_active"
                              [class.bg-green-600]="!user.is_active"
                              [class.hover:bg-green-700]="!user.is_active"
                              class="px-3 py-1 text-white rounded-lg transition text-xs font-semibold">
                        {{ user.is_active ? 'Block' : 'Activate' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Categories Tab -->
          <div *ngIf="activeTab === 'categories'" class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-white">Category Management</h2>
              <button (click)="showCategoryForm = true; editingCategory = null; categoryForm.reset()"
                      class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm">
                + Add Category
              </button>
            </div>

            <!-- Add/Edit Category Form -->
            <div *ngIf="showCategoryForm" class="mb-6 bg-gray-700 rounded-lg p-6">
              <h3 class="text-white font-bold mb-4">{{ editingCategory ? 'Edit' : 'Add New' }} Category</h3>
              <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">Name</label>
                    <input formControlName="name" type="text"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm">
                  </div>
                  <div>
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">Slug</label>
                    <input formControlName="slug" type="text"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm">
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">Description</label>
                    <textarea formControlName="description" rows="2"
                              class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm"></textarea>
                  </div>
                </div>
                <div class="flex gap-3 mt-4">
                  <button type="submit" 
                          [disabled]="categoryForm.invalid"
                          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-semibold">
                    💾 Save
                  </button>
                  <button type="button" (click)="cancelCategoryEdit()"
                          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 text-sm font-semibold">
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <!-- Categories List -->
            <div class="space-y-3">
              <div *ngFor="let category of categories" 
                   class="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 class="text-white font-bold">{{ category.name }}</h3>
                  <p class="text-gray-400 text-sm">{{ category.slug }}</p>
                </div>
                <div class="flex gap-2">
                  <button (click)="editCategory(category)"
                          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold">
                    ✏️ Edit
                  </button>
                  <button (click)="deleteCategory(category.id)"
                          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>

            <div *ngIf="categories.length === 0 && !showCategoryForm" class="text-center py-12">
              <div class="text-6xl mb-4">📁</div>
              <p class="text-gray-400">No categories yet</p>
            </div>
          </div>

          <!-- Products Tab WITH FULL CRUD -->
          <div *ngIf="activeTab === 'products'" class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-white">Product Management</h2>
              <button (click)="showProductForm = true; editingProduct = null; productForm.reset()"
                      class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm">
                + Add Product
              </button>
            </div>

            <!-- Add/Edit Product Form -->
            <div *ngIf="showProductForm" class="mb-6 bg-gray-700 rounded-lg p-6">
              <h3 class="text-white font-bold mb-4">{{ editingProduct ? 'Edit' : 'Add New' }} Product</h3>
              <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">Product Name</label>
                    <input formControlName="name" type="text"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm">
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">Description</label>
                    <textarea formControlName="description" rows="3"
                              class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm"></textarea>
                  </div>

                  <div>
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">Category</label>
                    <select formControlName="category"
                            class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm">
                      <option value="">Select Category</option>
                      <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">Daily Price (₹)</label>
                    <input formControlName="daily_price" type="number"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm">
                  </div>

                  <div>
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">Weekly Price (₹)</label>
                    <input formControlName="weekly_price" type="number"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm">
                  </div>

                  <div>
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">Monthly Price (₹)</label>
                    <input formControlName="monthly_price" type="number"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm">
                  </div>

                  <div>
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">Security Deposit (₹)</label>
                    <input formControlName="security_deposit" type="number"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm">
                  </div>

                  <div>
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">Quantity Available</label>
                    <input formControlName="quantity_available" type="number"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm">
                  </div>

                  <div>
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">City</label>
                    <input formControlName="city" type="text"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm">
                  </div>

                  <div>
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">State</label>
                    <input formControlName="state" type="text"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 text-sm">
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-gray-300 mb-2 text-sm font-semibold">Product Image</label>
                    <input type="file" (change)="onProductImageSelected($event)" accept="image/*"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 text-sm">
                    <p class="text-xs text-gray-400 mt-1">Upload product image (JPG, PNG)</p>
                  </div>

                  <div class="flex items-center gap-2">
                    <input formControlName="is_available" type="checkbox"
                           class="w-5 h-5 text-red-600 rounded border-gray-600 bg-gray-800">
                    <label class="text-gray-300 text-sm font-semibold">Available for Rent</label>
                  </div>
                </div>

                <div class="flex gap-3 mt-6">
                  <button type="submit" 
                          [disabled]="productForm.invalid || savingProduct"
                          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-semibold">
                    <span *ngIf="!savingProduct">💾 Save Product</span>
                    <span *ngIf="savingProduct">Saving...</span>
                  </button>
                  <button type="button" (click)="cancelProductEdit()"
                          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 text-sm font-semibold">
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <!-- Products List -->
            <div class="space-y-3">
              <div *ngFor="let product of products" 
                   class="bg-gray-700 rounded-lg p-4 flex items-center gap-4">
                <img [src]="getProductImage(product.main_image)" 
                     [alt]="product.name"
                     class="w-16 h-16 object-cover rounded-lg">
                
                <div class="flex-1">
                  <h3 class="font-bold text-white">{{ product.name }}</h3>
                  <div class="flex gap-4 text-sm text-gray-400">
                    <span>{{ product.category_name }}</span>
                    <span>{{ product.daily_price | inrCurrency }}/day</span>
                    <span>{{ product.city }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-xs font-bold"
                        [class.bg-green-600]="product.is_available"
                        [class.bg-gray-600]="!product.is_available"
                        class="text-white">
                    {{ product.is_available ? 'Available' : 'Unavailable' }}
                  </span>
                  <button (click)="editProduct(product)"
                          class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-semibold">
                    Edit
                  </button>
                  <button (click)="deleteProduct(product.id)"
                          class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-semibold">
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div *ngIf="products.length === 0 && !showProductForm" class="text-center py-12">
              <div class="text-6xl mb-4">📦</div>
              <p class="text-gray-400">No products yet</p>
            </div>
          </div>

          <!-- Rentals Tab -->
          <div *ngIf="activeTab === 'rentals'" class="p-6">
            <h2 class="text-2xl font-bold text-white mb-6">Rental Management</h2>
            
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-700">
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Product</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Duration</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Start Date</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">End Date</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Amount</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let rental of rentals" class="border-b border-gray-700 hover:bg-gray-700/50 transition">
                    <td class="py-3 px-4 text-white">{{ rental.product_details?.name || 'N/A' }}</td>
                    <td class="py-3 px-4 text-white capitalize">{{ rental.duration_type }}</td>
                    <td class="py-3 px-4 text-gray-400">{{ rental.start_date | date:'shortDate' }}</td>
                    <td class="py-3 px-4 text-gray-400">{{ rental.end_date | date:'shortDate' }}</td>
                    <td class="py-3 px-4 text-white">{{ rental.total_amount | inrCurrency }}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-1 rounded-full text-xs font-bold capitalize"
                            [class.bg-yellow-600]="rental.status === 'pending'"
                            [class.bg-green-600]="rental.status === 'active'"
                            [class.bg-gray-600]="rental.status === 'completed'"
                            class="text-white">
                        {{ rental.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <select (change)="updateRentalStatus(rental, $event)"
                              class="px-2 py-1 bg-gray-800 text-white rounded text-xs border border-gray-600">
                        <option value="">Change Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Payments Tab -->
          <div *ngIf="activeTab === 'payments'" class="p-6">
            <h2 class="text-2xl font-bold text-white mb-6">Payment Management</h2>
            
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-700">
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Transaction ID</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Method</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Amount</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    <th class="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let payment of payments" class="border-b border-gray-700 hover:bg-gray-700/50 transition">
                    <td class="py-3 px-4 text-white font-mono">{{ payment.transaction_id }}</td>
                    <td class="py-3 px-4 text-white capitalize">{{ payment.payment_method }}</td>
                    <td class="py-3 px-4 text-white">{{ payment.amount | inrCurrency }}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-1 rounded-full text-xs font-bold capitalize"
                            [class.bg-yellow-600]="payment.status === 'pending'"
                            [class.bg-green-600]="payment.status === 'success'"
                            [class.bg-red-600]="payment.status === 'failed'"
                            class="text-white">
                        {{ payment.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-gray-400">{{ payment.created_at | date:'short' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  user: any = null;
  activeTab = 'users';
  userFilter = 'all';
  
  stats = {
    total_users: 0,
    total_customers: 0,
    total_vendors: 0,
    total_products: 0,
    active_rentals: 0,
    monthly_revenue: 0
  };
  
  users: any[] = [];
  categories: any[] = [];
  products: any[] = [];
  rentals: any[] = [];
  payments: any[] = [];

  showCategoryForm = false;
  editingCategory: any = null;
  categoryForm: FormGroup;

  showProductForm = false;
  editingProduct: any = null;
  productForm: FormGroup;
  productImageFile: File | null = null;
  savingProduct = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['']
    });

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      daily_price: [0, Validators.required],
      weekly_price: [0],
      monthly_price: [0],
      security_deposit: [0],
      quantity_available: [1, Validators.required],
      city: ['', Validators.required],
      state: [''],
      is_available: [true]
    });
  }

  ngOnInit() {
    this.user = this.authService.currentUser;
    
    if (!this.user || (!this.user.is_superuser && this.user.role !== 'admin')) {
      this.toastService.error('Access denied');
      this.router.navigate(['/']);
      return;
    }

    this.loadAll();
  }

  loadAll() {
    this.loadStats();
    this.loadUsers();
    this.loadCategories();
    this.loadProducts();
    this.loadRentals();
    this.loadPayments();
  }

  loadStats() {
    this.http.get(`${environment.apiUrl}/auth/admin/stats/`).subscribe({
      next: (data: any) => this.stats = data,
      error: (err) => console.error('Error:', err)
    });
  }

  loadUsers() {
    const url = this.userFilter === 'all' 
      ? `${environment.apiUrl}/auth/admin/users/`
      : `${environment.apiUrl}/auth/admin/users/?role=${this.userFilter}`;
    
    this.http.get<any[]>(url).subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Error:', err)
    });
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/products/admin/categories/`).subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error('Error:', err)
    });
  }

  loadProducts() {
    this.http.get<any[]>(`${environment.apiUrl}/auth/admin/products/`).subscribe({
      next: (products) => this.products = products,
      error: (err) => console.error('Error:', err)
    });
  }

  loadRentals() {
    this.http.get<any[]>(`${environment.apiUrl}/auth/admin/rentals/`).subscribe({
      next: (rentals) => this.rentals = rentals,
      error: (err) => console.error('Error:', err)
    });
  }

  loadPayments() {
    this.http.get<any[]>(`${environment.apiUrl}/auth/admin/payments/`).subscribe({
      next: (payments) => this.payments = payments,
      error: (err) => console.error('Error:', err)
    });
  }

  filterUsers(filter: string) {
    this.userFilter = filter;
    this.loadUsers();
  }

  get filteredUsers() {
    return this.users;
  }

  toggleUser(user: any) {
    this.http.patch(`${environment.apiUrl}/auth/admin/users/${user.id}/toggle/`, {}).subscribe({
      next: (response: any) => {
        this.toastService.success(response.message);
        this.loadUsers();
        this.loadStats();
      },
      error: () => this.toastService.error('Failed to update user')
    });
  }

  // Category Methods
  editCategory(category: any) {
    this.editingCategory = category;
    this.categoryForm.patchValue(category);
    this.showCategoryForm = true;
  }

  saveCategory() {
    if (this.categoryForm.valid) {
      const url = this.editingCategory
        ? `${environment.apiUrl}/products/admin/categories/${this.editingCategory.id}/`
        : `${environment.apiUrl}/products/admin/categories/`;
      
      const method = this.editingCategory ? 'patch' : 'post';

      this.http[method](url, this.categoryForm.value).subscribe({
        next: () => {
          this.toastService.success(this.editingCategory ? 'Category updated' : 'Category created');
          this.cancelCategoryEdit();
          this.loadCategories();
          this.loadStats();
        },
        error: () => this.toastService.error('Failed to save category')
      });
    }
  }

  cancelCategoryEdit() {
    this.showCategoryForm = false;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  deleteCategory(id: string) {
    if (confirm('Delete this category?')) {
      this.http.delete(`${environment.apiUrl}/products/admin/categories/${id}/`).subscribe({
        next: () => {
          this.toastService.success('Category deleted');
          this.loadCategories();
          this.loadStats();
        },
        error: () => this.toastService.error('Failed to delete')
      });
    }
  }

  // Product Methods
  onProductImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
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
  }

  saveProduct() {
    if (this.productForm.valid) {
      this.savingProduct = true;
      
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(this.productForm.value).forEach(key => {
        if (this.productForm.value[key] !== null && this.productForm.value[key] !== '') {
          formData.append(key, this.productForm.value[key]);
        }
      });

      // Append image if selected
      if (this.productImageFile) {
        formData.append('main_image', this.productImageFile);
      }

      // Set vendor to current admin user
      formData.append('vendor', this.user.id);

      const url = this.editingProduct
        ? `${environment.apiUrl}/products/admin/products/${this.editingProduct.id}/`
        : `${environment.apiUrl}/products/admin/products/create/`;
      
      const method = this.editingProduct ? 'patch' : 'post';

      this.http[method](url, formData).subscribe({
        next: () => {
          this.toastService.success(this.editingProduct ? 'Product updated!' : 'Product created!');
          this.cancelProductEdit();
          this.loadProducts();
          this.loadStats();
        },
        error: (err) => {
          console.error('Error saving product:', err);
          this.toastService.error('Failed to save product');
          this.savingProduct = false;
        }
      });
    }
  }

  cancelProductEdit() {
    this.showProductForm = false;
    this.editingProduct = null;
    this.productForm.reset();
    this.productImageFile = null;
    this.savingProduct = false;
  }

  deleteProduct(id: string) {
    if (confirm('Delete this product?')) {
      this.http.delete(`${environment.apiUrl}/products/admin/products/${id}/`).subscribe({
        next: () => {
          this.toastService.success('Product deleted');
          this.loadProducts();
          this.loadStats();
        },
        error: () => this.toastService.error('Failed to delete')
      });
    }
  }

  updateRentalStatus(rental: any, event: any) {
    const status = event.target.value;
    if (!status) return;

    this.http.patch(`${environment.apiUrl}/products/admin/rentals/${rental.id}/`, { status }).subscribe({
      next: () => {
        this.toastService.success('Rental status updated');
        this.loadRentals();
        this.loadStats();
        event.target.value = '';
      },
      error: () => this.toastService.error('Failed to update')
    });
  }

  getProductImage(imagePath: string | undefined): string {
    if (!imagePath) return '/assets/placeholder-product.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath}`;
  }

  logout() {
    this.authService.logout();
    this.toastService.success('Logged out');
    this.router.navigate(['/admin-login']);
  }
}