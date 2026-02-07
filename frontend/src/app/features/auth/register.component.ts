import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div class="max-w-md w-full">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-4xl font-bold text-gray-900 mb-2">Join Rentkart</h2>
          <p class="text-gray-600">Start renting today! Create your free account.</p>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            
            <!-- First Name -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input formControlName="first_name" type="text" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                     placeholder="John"
                     [class.border-red-500]="isFieldInvalid('first_name')">
              <p *ngIf="isFieldInvalid('first_name')" class="mt-1 text-sm text-red-600">
                First name is required
              </p>
            </div>

            <!-- Last Name -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input formControlName="last_name" type="text" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                     placeholder="Doe"
                     [class.border-red-500]="isFieldInvalid('last_name')">
              <p *ngIf="isFieldInvalid('last_name')" class="mt-1 text-sm text-red-600">
                Last name is required
              </p>
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input formControlName="email" type="email" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                     placeholder="john@example.com"
                     [class.border-red-500]="isFieldInvalid('email')">
              <p *ngIf="isFieldInvalid('email')" class="mt-1 text-sm text-red-600">
                <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</span>
              </p>
            </div>

            <!-- Phone (Optional) -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span class="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input formControlName="phone" type="tel" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                     placeholder="+91 98765 43210">
            </div>

            <!-- Role Selection -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">I want to</label>
              <div class="grid grid-cols-2 gap-3">
                <label class="relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition"
                       [class.border-blue-600]="registerForm.get('role')?.value === 'customer'"
                       [class.bg-blue-50]="registerForm.get('role')?.value === 'customer'">
                  <input type="radio" formControlName="role" value="customer" class="sr-only">
                  <div class="text-center">
                    <div class="text-2xl mb-1">🛍️</div>
                    <div class="font-semibold">Rent Items</div>
                  </div>
                </label>
                <label class="relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition"
                       [class.border-blue-600]="registerForm.get('role')?.value === 'vendor'"
                       [class.bg-blue-50]="registerForm.get('role')?.value === 'vendor'">
                  <input type="radio" formControlName="role" value="vendor" class="sr-only">
                  <div class="text-center">
                    <div class="text-2xl mb-1">🏪</div>
                    <div class="font-semibold">List Items</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input formControlName="password" type="password" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                     placeholder="••••••••"
                     [class.border-red-500]="isFieldInvalid('password')">
              <p *ngIf="isFieldInvalid('password')" class="mt-1 text-sm text-red-600">
                Password must be at least 6 characters
              </p>
            </div>

            <!-- Confirm Password -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input formControlName="password_confirm" type="password" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                     placeholder="••••••••"
                     [class.border-red-500]="isFieldInvalid('password_confirm')">
              <p *ngIf="isFieldInvalid('password_confirm')" class="mt-1 text-sm text-red-600">
                <span *ngIf="registerForm.get('password_confirm')?.errors?.['required']">Please confirm your password</span>
                <span *ngIf="registerForm.errors?.['passwordMismatch']">Passwords do not match</span>
              </p>
            </div>

            <!-- Error Message -->
            <div *ngIf="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-600 text-sm">{{ error }}</p>
            </div>

            <!-- Success Message -->
            <div *ngIf="success" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-green-600 text-sm">✓ Account created! Redirecting...</p>
            </div>

            <!-- Submit Button -->
            <button type="submit" 
                    [disabled]="registerForm.invalid || loading"
                    class="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
              <span *ngIf="!loading">Create Account</span>
              <span *ngIf="loading" class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            </button>

            <!-- Login Link -->
            <div class="mt-6 text-center">
              <p class="text-gray-600">
                Already have an account? 
                <a routerLink="/auth/login" class="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['customer', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirm: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('password_confirm');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1500);
        },
        error: (err) => {
          this.loading = false;
          if (err.error?.email) {
            this.error = 'Email already exists';
          } else if (err.error?.password) {
            this.error = err.error.password[0];
          } else {
            this.error = 'Registration failed. Please try again.';
          }
        }
      });
    }
  }
}