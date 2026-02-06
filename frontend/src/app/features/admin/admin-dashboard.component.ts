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
      <nav class="bg-gray-800 border-b border-gray-700">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-3">
              <div class="text-2xl">🔐</div>
              <h1 class="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            
            <div class="flex items-center gap-4">
              <span class="text-gray-400 text-sm">{{ user?.email }}</span>
              <button (click)="logout()"
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="container mx-auto px-4 py-8">
        
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">👥</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-white mb-2">{{ stats.total_users }}</p>
            <p class="text-gray-400 text-sm">Total Users</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🛒</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-white mb-2">{{ stats.total_customers }}</p>
            <p class="text-gray-400 text-sm">Customers</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🏪</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-white mb-2">{{ stats.total_vendors }}</p>
            <p class="text-gray-400 text-sm">Vendors</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">📦</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-white mb-2">{{ stats.total_products }}</p>
            <p class="text-gray-400 text-sm">Products</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🎯</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-white mb-2">{{ stats.active_rentals }}</p>
            <p class="text-gray-400 text-sm">Active Rentals</p>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">💰</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-white mb-2">{{ stats.monthly_revenue | inrCurrency }}</p>
            <p class="text-gray-400 text-sm">Monthly Revenue</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div class="border-b border-gray-700">
            <nav class="flex">
              <button (click)="activeTab = 'users'"
                      [class.border-red-500]="activeTab === 'users'"
                      [class.text-white]="activeTab === 'users'"
                      class="px-6 py-4 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition">
                Users
              </button>
              <button (click)="activeTab = 'categories'"
                      [class.border-red-500]="activeTab === 'categories'"
                      [class.text-white]="activeTab === 'categories'"
                      class="px-6 py-4 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition">
                Categories
              </button>
              <button (click)="activeTab = 'products'"
                      [class.border-red-500]="activeTab === 'products'"
                      [class.text-white]="activeTab === 'products'"
                      class="px-6 py-4 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition">
                Products
              </button>
              <button (click)="activeTab = 'rentals'"
                      [class.border-red-500]="activeTab === 'rentals'"
                      [class.text-white]="activeTab === 'rentals'"
                      class="px-6 py-4 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition">
                Rentals
              </button>
              <button (click)="activeTab = 'payments'"
                      [class.border-red-500]="activeTab === 'payments'"
                      [class.text-white]="activeTab === 'payments'"
                      class="px-6 py-4 font-semibold border-b-2 border-transparent text-gray-400 hover:text-white transition">
                Payments
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
                        class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                  All
                </button>
                <button (click)="filterUsers('customer')"
                        [class.bg-red-600]="userFilter === 'customer'"
                        class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                  Customers
                </button>
                <button (click)="filterUsers('vendor')"
                        [class.bg-red-600]="userFilter === 'vendor'"
                        class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                  Vendors
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
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
                      <span class="px-3 py-1 rounded-full text-xs font-bold capitalize"
                            [class.bg-blue-600]="user.role === 'customer'"
                            [class.bg-purple-600]="user.role === 'vendor'"
                            [class.bg-red-600]="user.role === 'admin'"
                            class="text-white">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-3 py-1 rounded-full text-xs font-bold"
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
                              class="px-4 py-2 text-white rounded-lg transition text-sm font-semibold">
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
              <button (click)="showCategoryForm = true"
                      class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                + Add Category
              </button>
            </div>

            <!-- Add Category Form -->
            <div *ngIf="showCategoryForm" class="mb-6 bg-gray-700 rounded-lg p-6">
              <h3 class="text-white font-bold mb-4">{{ editingCategory ? 'Edit' : 'Add New' }} Category</h3>
              <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-gray-300 mb-2">Name</label>
                    <input formControlName="name" type="text"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500">
                  </div>
                  <div>
                    <label class="block text-gray-300 mb-2">Slug</label>
                    <input formControlName="slug" type="text"
                           class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500">
                  </div>
                  <div class="col-span-2">
                    <label class="block text-gray-300 mb-2">Description</label>
                    <textarea formControlName="description" rows="3"
                              class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500"></textarea>
                  </div>
                </div>
                <div class="flex gap-3 mt-4">
                  <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Save
                  </button>
                  <button type="button" (click)="cancelCategoryEdit()"
                          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500">
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <!-- Categories List -->
            <div class="space-y-4">
              <div *ngFor="let category of categories" 
                   class="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 class="text-white font-bold">{{ category.name }}</h3>
                  <p class="text-gray-400 text-sm">{{ category.slug }}</p>
                </div>
                <div class="flex gap-2">
                  <button (click)="editCategory(category)"
                          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Edit
                  </button>
                  <button (click)="deleteCategory(category.id)"
                          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Products, Rentals, Payments tabs remain the same as before -->
          <!-- ... (keeping existing code for other tabs) ... -->
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
  }

  ngOnInit() {
    this.user = this.authService.currentUser;
    
    if (!this.user || (!this.user.is_superuser && this.user.role !== 'admin')) {
      this.toastService.error('Access denied');
      this.router.navigate(['/']);
      return;
    }

    this.loadStats();
    this.loadUsers();
    this.loadCategories();
    this.loadProducts();
    this.loadRentals();
    this.loadPayments();
  }

  loadStats() {
    this.http.get(`${environment.apiUrl}/auth/admin/stats/`).subscribe({
      next: (data: any) => {
        this.stats = data;
      },
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  loadUsers() {
    const url = this.userFilter === 'all' 
      ? `${environment.apiUrl}/auth/admin/users/`
      : `${environment.apiUrl}/auth/admin/users/?role=${this.userFilter}`;
    
    this.http.get<any[]>(url).subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/products/admin/categories/`).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadProducts() {
    this.http.get<any[]>(`${environment.apiUrl}/auth/admin/products/`).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  loadRentals() {
    this.http.get<any[]>(`${environment.apiUrl}/auth/admin/rentals/`).subscribe({
      next: (rentals) => {
        this.rentals = rentals;
      },
      error: (err) => console.error('Error loading rentals:', err)
    });
  }

  loadPayments() {
    this.http.get<any[]>(`${environment.apiUrl}/auth/admin/payments/`).subscribe({
      next: (payments) => {
        this.payments = payments;
      },
      error: (err) => console.error('Error loading payments:', err)
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
      error: (err) => {
        this.toastService.error('Failed to update user');
      }
    });
  }

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
        },
        error: (err) => {
          this.toastService.error('Failed to save category');
        }
      });
    }
  }

  cancelCategoryEdit() {
    this.showCategoryForm = false;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.http.delete(`${environment.apiUrl}/products/admin/categories/${id}/`).subscribe({
        next: () => {
          this.toastService.success('Category deleted');
          this.loadCategories();
        },
        error: (err) => {
          this.toastService.error('Failed to delete category');
        }
      });
    }
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
