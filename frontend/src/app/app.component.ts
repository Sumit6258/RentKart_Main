import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <!-- Toast Container - FIXED VERSION -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div *ngFor="let toast of toastService.toasts" 
           [ngClass]="{
             'bg-green-500': toast.type === 'success',
             'bg-red-500': toast.type === 'error',
             'bg-blue-500': toast.type === 'info',
             'bg-yellow-500': toast.type === 'warning'
           }"
           class="px-6 py-4 rounded-lg shadow-lg text-white font-semibold min-w-[300px] animate-slide-in">
        {{ toast.message }}
      </div>
    </div>

    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2">
            <span class="text-2xl">🏠</span>
            <span class="text-2xl font-black text-blue-600">Rentkart</span>
          </a>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/" routerLinkActive="text-blue-600" [routerLinkActiveOptions]="{exact: true}"
               class="text-gray-700 hover:text-blue-600 font-semibold transition">
              Home
            </a>
            <a routerLink="/products" routerLinkActive="text-blue-600"
               class="text-gray-700 hover:text-blue-600 font-semibold transition">
              Products
            </a>
            <a routerLink="/about" routerLinkActive="text-blue-600"
               class="text-gray-700 hover:text-blue-600 font-semibold transition">
              About
            </a>
          </div>

          <!-- User Menu -->
          <div class="flex items-center gap-4">
            <ng-container *ngIf="!(authService.currentUser$ | async); else loggedIn">
              <a routerLink="/auth/login"
                 class="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition">
                Login
              </a>
              <a routerLink="/auth/register"
                 class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg transition">
                Get Started
              </a>
            </ng-container>

            <ng-template #loggedIn>
              <div class="relative" (click)="toggleDropdown()">
                <button class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {{ getUserInitial() }}
                  </div>
                  <span class="font-semibold text-gray-900 hidden sm:block">
                    {{ (authService.currentUser$ | async)?.first_name || (authService.currentUser$ | async)?.email }}
                  </span>
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div *ngIf="dropdownOpen" 
                     class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2">
                  
                  <!-- Customer Menu -->
                  <ng-container *ngIf="(authService.currentUser$ | async)?.role === 'customer'">
                    <a routerLink="/dashboard" (click)="closeDropdown()"
                       class="block px-4 py-3 hover:bg-blue-50 transition flex items-center gap-3">
                      <span class="text-xl">📊</span>
                      <span class="font-semibold text-gray-900">Dashboard</span>
                    </a>
                  </ng-container>

                  <!-- Vendor Menu -->
                  <ng-container *ngIf="(authService.currentUser$ | async)?.role === 'vendor'">
                    <a routerLink="/vendor" (click)="closeDropdown()"
                       class="block px-4 py-3 hover:bg-purple-50 transition flex items-center gap-3">
                      <span class="text-xl">🏪</span>
                      <span class="font-semibold text-gray-900">Vendor Dashboard</span>
                    </a>
                  </ng-container>

                  <!-- Admin Menu -->
                  <ng-container *ngIf="(authService.currentUser$ | async)?.role === 'admin' || (authService.currentUser$ | async)?.is_superuser">
                    <a routerLink="/admin-dashboard" (click)="closeDropdown()"
                       class="block px-4 py-3 hover:bg-red-50 transition flex items-center gap-3">
                      <span class="text-xl">🔐</span>
                      <span class="font-semibold text-gray-900">Admin Panel</span>
                    </a>
                  </ng-container>

                  <div class="border-t border-gray-200 my-2"></div>

                  <button (click)="logout()"
                          class="w-full text-left px-4 py-3 hover:bg-red-50 transition flex items-center gap-3">
                    <span class="text-xl">🚪</span>
                    <span class="font-semibold text-red-600">Logout</span>
                  </button>
                </div>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 mt-20">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="text-3xl">🏠</span>
              <span class="text-2xl font-black">Rentkart</span>
            </div>
            <p class="text-gray-400">India's fastest-growing rental marketplace</p>
          </div>

          <div>
            <h3 class="font-bold text-lg mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a routerLink="/" class="text-gray-400 hover:text-white transition">Home</a></li>
              <li><a routerLink="/products" class="text-gray-400 hover:text-white transition">Products</a></li>
              <li><a routerLink="/about" class="text-gray-400 hover:text-white transition">About</a></li>
              <li><a routerLink="/auth/register" class="text-gray-400 hover:text-white transition">Register</a></li>
            </ul>
          </div>

          <div>
            <h3 class="font-bold text-lg mb-4">Support</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white transition">Help Center</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition">Contact Us</a></li>
              <li><a routerLink="/rental-terms" class="text-gray-400 hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 class="font-bold text-lg mb-4">Connect</h3>
            <p class="text-gray-400 mb-2">📧 support&#64;rentkart.in</p>
            <p class="text-gray-400">📱 +91 92641 76210</p>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Rentkart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `]
})
export class AppComponent {
  dropdownOpen = false;

  constructor(
    public authService: AuthService,
    public toastService: ToastService,
    private router: Router
  ) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  getUserInitial(): string {
    const user = this.authService.currentUser;
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  }

  logout() {
    this.authService.logout();
    this.toastService.success('Logged out successfully');
    this.closeDropdown();
  }
}
