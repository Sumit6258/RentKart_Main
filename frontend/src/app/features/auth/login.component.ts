import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-black text-gray-900 mb-2">Welcome Back! 👋</h1>
          <p class="text-gray-600">Login to your Rentkart account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input formControlName="email" type="email" placeholder="you@example.com"
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <p *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                 class="text-red-500 text-xs mt-1">Valid email is required</p>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input formControlName="password" type="password" placeholder="••••••••"
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                 class="text-red-500 text-xs mt-1">Password is required</p>
            </div>

            <button type="submit" 
                    [disabled]="loginForm.invalid || isLoading"
                    class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition shadow-lg">
              <span *ngIf="!isLoading">Login</span>
              <span *ngIf="isLoading">Logging in...</span>
            </button>
          </div>
        </form>

        <p class="text-center text-gray-600 mt-6">
          Don't have an account? 
          <a routerLink="/auth/register" class="text-blue-600 font-bold hover:underline">Register</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          this.toastService.success(`Welcome back, ${response.user.first_name || 'User'}!`);
          this.isLoading = false;
        },
        error: (err: any) => {
          this.toastService.error(err.error?.error || 'Login failed');
          this.isLoading = false;
        }
      });
    }
  }
}
