import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🏠</div>
          <h2 class="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p class="text-gray-600">Sign in to continue to Rentkart</p>
        </div>

        <div class="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-5">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input formControlName="email" type="email" 
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                     placeholder="john@example.com"
                     [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              <p *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                 class="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Valid email is required
              </p>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input formControlName="password" type="password" 
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                     placeholder="••••••••"
                     [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                 class="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Password is required
              </p>
            </div>

            <button type="submit" 
                    [disabled]="loginForm.invalid || loading"
                    class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <span *ngIf="!loading">Sign In</span>
              <span *ngIf="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            </button>

            <div class="mt-6 text-center">
              <p class="text-gray-600">
                Don't have an account? 
                <a routerLink="/auth/register" class="text-blue-600 hover:text-blue-700 font-bold">
                  Create one now
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl = '/products';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Get return URL from route parameters or default to '/products'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.toastService.success('🎉 Login successful!');
          // Navigate to return URL or products
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (err) => {
          this.toastService.error('❌ Invalid email or password');
          this.loading = false;
        }
      });
    }
  }
}
