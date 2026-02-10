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
    <!-- Toast Notifications -->
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

    <!-- Admin Header -->
    <nav *ngIf="authService.isLoggedIn" class="bg-gray-900 text-white shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🔐</span>
            <span class="text-xl font-bold">Rentkart Admin Panel</span>
          </div>

          <div class="flex items-center gap-4">
            <span class="text-sm">👤 {{ (authService.currentUser$ | async)?.email }}</span>
            <button (click)="logout()"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm transition">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-outlet></router-outlet>
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
  constructor(
    public authService: AuthService,
    public toastService: ToastService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.toastService.success('Logged out successfully');
  }
}
