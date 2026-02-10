import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🔐</div>
          <h1 class="text-4xl font-black text-gray-900 mb-2">Admin Access</h1>
          <p class="text-gray-600">Authorized personnel only</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Admin Email</label>
              <input formControlName="email" type="email" placeholder="admin@rentkart.com"
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500">
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input formControlName="password" type="password" placeholder="••••••••"
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500">
            </div>

            <button type="submit" 
                    [disabled]="loginForm.invalid || isLoading"
                    class="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-pink-700 disabled:opacity-50 transition shadow-lg">
              <span *ngIf="!isLoading">🔓 Admin Login</span>
              <span *ngIf="isLoading">Authenticating...</span>
            </button>
          </div>
        </form>

        <p class="text-center text-gray-500 mt-6 text-sm">
          <a routerLink="/" class="hover:underline">← Back to Home</a>
        </p>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      this.authService.adminLogin(this.loginForm.value).subscribe({
        next: (response: any) => {
          this.toastService.success('Admin access granted');
          this.isLoading = false;
        },
        error: (err: any) => {
          this.toastService.error(err.error?.error || 'Access denied');
          this.isLoading = false;
        }
      });
    }
  }
}
