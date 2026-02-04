import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent],
  template: `
    <app-toast></app-toast>

    <nav class="bg-white shadow-md sticky top-0 z-40">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <a routerLink="/" class="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
            🏠 Rentkart
          </a>
          
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/" 
               routerLinkActive="text-blue-600 font-semibold"
               [routerLinkActiveOptions]="{exact: true}"
               class="hover:text-blue-600 transition">
              Home
            </a>
            <a routerLink="/products" 
               routerLinkActive="text-blue-600 font-semibold"
               class="hover:text-blue-600 transition">
              Products
            </a>
            <a routerLink="/about" 
               routerLinkActive="text-blue-600 font-semibold"
               class="hover:text-blue-600 transition">
              About
            </a>
          </div>
          
          <div class="flex items-center gap-3">
            <ng-container *ngIf="!(authService.currentUser$ | async); else loggedIn">
              <a routerLink="/auth/login" 
                 class="px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium">
                Login
              </a>
              <a routerLink="/auth/register" 
                 class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
                Get Started
              </a>
            </ng-container>
            
            <ng-template #loggedIn>
              <div class="relative" (click)="toggleDropdown()">
                <button class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                  <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {{ getUserInitial() }}
                  </div>
                  <span class="font-medium hidden md:block">
                    {{ (authService.currentUser$ | async)?.full_name || (authService.currentUser$ | async)?.email }}
                  </span>
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
                
                <div *ngIf="showDropdown" 
                     class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  <a *ngIf="(authService.currentUser$ | async)?.role === 'vendor'" 
                     routerLink="/vendor-dashboard" 
                     class="block px-4 py-2 hover:bg-gray-100 transition">
                    🏪 Vendor Dashboard
                  </a>
                  <a routerLink="/dashboard" 
                     class="block px-4 py-2 hover:bg-gray-100 transition">
                    📊 Dashboard
                  </a>
                  <a routerLink="/dashboard" [queryParams]="{tab: 'rentals'}"
                     class="block px-4 py-2 hover:bg-gray-100 transition">
                    🛍️ My Rentals
                  </a>
                  <a routerLink="/dashboard" [queryParams]="{tab: 'profile'}"
                     class="block px-4 py-2 hover:bg-gray-100 transition">
                    👤 Profile
                  </a>
                  <hr class="my-2">
                  <button (click)="logout()" 
                          class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition">
                    🚪 Logout
                  </button>
                </div>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>

    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-gray-900 text-white py-12 mt-20">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">🏠 Rentkart</h3>
            <p class="text-gray-400">Rent anything, anytime. Your trusted rental marketplace.</p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li><a routerLink="/products" class="text-gray-400 hover:text-white transition">Browse Products</a></li>
              <li><a routerLink="/about" class="text-gray-400 hover:text-white transition">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Categories</h4>
            <ul class="space-y-2">
              <li><a class="text-gray-400 hover:text-white transition cursor-pointer">Electronics</a></li>
              <li><a class="text-gray-400 hover:text-white transition cursor-pointer">Furniture</a></li>
              <li><a class="text-gray-400 hover:text-white transition cursor-pointer">Appliances</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Contact</h4>
            <ul class="space-y-2 text-gray-400">
              <li>📧 support&#64;rentkart.com</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Mumbai, India</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Rentkart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
})
export class AppComponent {
  showDropdown = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
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
    this.router.navigate(['/']);
    this.showDropdown = false;
  }
}
