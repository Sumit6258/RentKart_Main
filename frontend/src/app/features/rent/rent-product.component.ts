import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';
import { InrCurrencyPipe } from '../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-rent-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, InrCurrencyPipe],
  styles: [`
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
  `],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div class="container mx-auto px-4 max-w-5xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Complete Your Rental</h1>
          <p class="text-gray-600">Choose your rental plan and get started</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="!product" class="text-center py-20">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-600 mt-4">Loading product details...</p>
        </div>

        <div *ngIf="product" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left: Rental Configuration Form -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
                <span class="text-3xl">🎯</span>
                Select Your Rental Plan
              </h2>
              
              <form [formGroup]="rentalForm" (ngSubmit)="submitRental()">
                
                <!-- Step 1: Duration Type Selection -->
                <div class="mb-8">
                  <label class="block text-sm font-bold text-gray-700 mb-4">
                    Step 1: Choose Rental Duration
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label *ngFor="let type of durationTypes" 
                           class="relative cursor-pointer group">
                      <input type="radio" 
                             formControlName="duration_type" 
                             [value]="type.value" 
                             class="sr-only">
                      <div [class.border-blue-600]="rentalForm.get('duration_type')?.value === type.value"
                           [class.bg-blue-50]="rentalForm.get('duration_type')?.value === type.value"
                           [class.shadow-lg]="rentalForm.get('duration_type')?.value === type.value"
                           class="border-2 rounded-xl p-6 text-center transition-all hover:border-blue-400 hover:shadow-md">
                        
                        <div class="text-4xl mb-3">{{ type.icon }}</div>
                        <p class="font-bold text-lg mb-2">{{ type.label }}</p>
                        <p class="text-3xl font-bold text-blue-600 mb-1">
                          {{ getPrice(type.value) | inrCurrency }}
                        </p>
                        <p class="text-xs text-gray-500 mb-2">{{ type.description }}</p>
                        
                        <span *ngIf="type.savings" 
                              class="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                          💰 Save {{ type.savings }}
                        </span>
                        
                        <div *ngIf="rentalForm.get('duration_type')?.value === type.value"
                             class="mt-3 flex items-center justify-center gap-2 text-blue-600 font-semibold text-sm">
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                          </svg>
                          Selected
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Step 2: Start Date Selection -->
                <div class="mb-8">
                  <label class="block text-sm font-bold text-gray-700 mb-2">
                    Step 2: Select Start Date
                  </label>
                  <input type="date" 
                         formControlName="start_date" 
                         [min]="minDate"
                         class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg">
                  <p class="text-sm text-gray-600 mt-2">
                    📅 Your rental will end on: <strong>{{ getEndDate() | date:'fullDate' }}</strong>
                  </p>
                </div>

                <!-- Step 3: Price Breakdown with GST -->
                <div class="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                  <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                    <span class="text-2xl">💵</span>
                    Price Breakdown
                  </h3>
                  <div class="space-y-3">
                    <!-- Base Rental Cost -->
                    <div class="flex justify-between items-center">
                      <span class="text-gray-700">Rental Cost ({{ getDurationLabel() }})</span>
                      <span class="font-bold text-lg">{{ getPrice(rentalForm.get('duration_type')?.value) | inrCurrency }}</span>
                    </div>
                    
                    <!-- GST -->
                    <div class="flex justify-between items-center">
                      <span class="text-gray-700">GST (18%)</span>
                      <span class="font-bold text-lg">{{ getGSTAmount() | inrCurrency }}</span>
                    </div>
                    
                    <!-- Subtotal -->
                    <div class="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span class="text-gray-700 font-semibold">Subtotal</span>
                      <span class="font-bold text-lg">{{ getSubtotal() | inrCurrency }}</span>
                    </div>
                    
                    <!-- Security Deposit -->
                    <div *ngIf="product.security_deposit && product.security_deposit > 0" 
                         class="flex justify-between items-center">
                      <span class="text-gray-700">Security Deposit (Refundable)</span>
                      <span class="font-bold text-lg">{{ product.security_deposit | inrCurrency }}</span>
                    </div>
                    
                    <!-- Total -->
                    <div class="border-t-2 border-blue-300 pt-3 flex justify-between items-center">
                      <span class="font-bold text-xl">Total Payable</span>
                      <span class="text-3xl font-bold text-blue-600">{{ getTotalAmount() | inrCurrency }}</span>
                    </div>
                  </div>
                  
                  <div *ngIf="product.security_deposit && product.security_deposit > 0" 
                       class="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p class="text-xs text-green-800 flex items-center gap-2">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                      </svg>
                      <strong>Security deposit will be fully refunded</strong> after product return in original condition
                    </p>
                  </div>
                </div>

                <!-- Step 4: Terms & Conditions -->
<div class="mb-8">
  <label class="flex items-start gap-3 cursor-pointer group">
    <input type="checkbox" 
           formControlName="acceptTerms"
           class="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500">

    <span class="text-sm text-gray-700 group-hover:text-gray-900">
      I agree to the 
      
      <a routerLink="/rental-terms"
         target="_blank"
         class="text-blue-600 hover:text-blue-700 font-semibold underline">
        rental terms and conditions
      </a>, 
      
      and understand that I am responsible for the product during the rental period.
    </span>
  </label>
</div>


                <!-- Submit Button -->
                <button type="submit" 
                        [disabled]="rentalForm.invalid || loading"
                        class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                  <span *ngIf="!loading" class="flex items-center justify-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Proceed to Payment
                  </span>
                  <span *ngIf="loading" class="flex items-center justify-center gap-3">
                    <svg class="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                </button>

                <p class="text-center text-sm text-gray-500 mt-4">
                  🔒 Secure checkout • Your payment information is encrypted
                </p>
              </form>
            </div>
          </div>

          <!-- Right: Order Summary (Sticky) -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-100">
              <h3 class="font-bold text-xl mb-6 flex items-center gap-2">
                <span class="text-2xl">📦</span>
                Order Summary
              </h3>
              
              <!-- Product Card -->
              <div class="flex gap-4 mb-6 pb-6 border-b-2 border-gray-100">
                <img [src]="productService.getImageUrl(product.main_image)" 
                     [alt]="product.name"
                     class="w-24 h-24 object-cover rounded-xl shadow-md border border-gray-200">
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-sm line-clamp-2 mb-2">{{ product.name }}</h4>
                  <p class="text-xs text-gray-600 mb-1">
                    <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                      {{ product.category_name }}
                    </span>
                  </p>
                  <p class="text-xs text-gray-600 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    {{ product.city }}
                  </p>
                </div>
              </div>

              <!-- Rental Details -->
              <div class="space-y-3 mb-6">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">📅 Duration:</span>
                  <span class="font-bold">{{ getDurationLabel() }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">🗓️ Start Date:</span>
                  <span class="font-bold">{{ rentalForm.get('start_date')?.value | date:'shortDate' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">🏁 End Date:</span>
                  <span class="font-bold">{{ getEndDate() | date:'shortDate' }}</span>
                </div>
              </div>

              <!-- Total -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-gray-900">Total Payable</span>
                  <span class="text-3xl font-bold text-blue-600">{{ getTotalAmount() | inrCurrency }}</span>
                </div>
              </div>

              <!-- Trust Badges -->
              <div class="mt-6 space-y-2 text-xs text-gray-600">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>100% Secure Payment</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Free Delivery & Pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div *ngIf="showPaymentModal" 
         class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         (click)="showPaymentModal = false">
      <div (click)="$event.stopPropagation()" 
           class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-in">
        
        <!-- Processing State -->
        <div *ngIf="processingPayment" class="p-12 text-center">
          <div class="w-24 h-24 mx-auto mb-6 relative">
            <div class="absolute inset-0 border-8 border-blue-200 rounded-full"></div>
            <div class="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h3 class="text-2xl font-bold mb-2 animate-pulse">Processing Payment...</h3>
          <p class="text-gray-600">Please wait while we process your transaction</p>
        </div>

        <!-- Payment Selection -->
        <div *ngIf="!processingPayment && !paymentSuccess && !paymentFailed">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h3 class="text-2xl font-bold mb-2">Complete Payment</h3>
            <p class="text-blue-100">Total Amount: {{ getTotalAmount() | inrCurrency }}</p>
          </div>

          <div class="p-6">
            <h4 class="font-bold mb-4">Select Payment Method</h4>
            <div class="space-y-3">
              <label *ngFor="let method of paymentMethods" 
                     class="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition hover:border-blue-500"
                     [class.border-blue-600]="selectedPaymentMethod === method.value"
                     [class.bg-blue-50]="selectedPaymentMethod === method.value">
                <input type="radio" 
                       [(ngModel)]="selectedPaymentMethod" 
                       [value]="method.value"
                       name="paymentMethod"
                       class="w-5 h-5 text-blue-600">
                <div class="text-3xl">{{ method.icon }}</div>
                <div class="flex-1">
                  <p class="font-bold">{{ method.label }}</p>
                  <p class="text-sm text-gray-600">{{ method.description }}</p>
                </div>
              </label>
            </div>

            <div class="flex gap-3 mt-6">
              <button (click)="processPayment()" 
                      [disabled]="!selectedPaymentMethod"
                      class="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 shadow-lg transition">
                Pay {{ getTotalAmount() | inrCurrency }}
              </button>
              <button (click)="showPaymentModal = false"
                      class="px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Success State with Invoice -->
        <div *ngIf="paymentSuccess" class="p-12 text-center">
          <div class="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h3>
          <p class="text-gray-600 mb-4">Your rental has been confirmed</p>
          
          <!-- Invoice Info -->
          <div *ngIf="invoiceData" class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 text-left">
            <p class="text-sm font-bold text-blue-900 mb-2">📄 Invoice Generated</p>
            <p class="text-xs text-gray-700">Invoice No: <strong>{{ invoiceData.invoice_number }}</strong></p>
            <p class="text-xs text-gray-700">Transaction ID: <strong>{{ paymentData?.transaction_id }}</strong></p>
          </div>
          
          <div class="flex gap-3 justify-center">
            <button (click)="viewInvoice()"
                    class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">
              View Invoice
            </button>
            <button (click)="goToDashboard()"
                    class="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg">
              My Rentals
            </button>
          </div>
        </div>

        <!-- Failed State -->
        <div *ngIf="paymentFailed" class="p-12 text-center">
          <div class="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg class="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 class="text-3xl font-bold text-red-600 mb-2">Payment Failed</h3>
          <p class="text-gray-600 mb-6">{{ paymentError }}</p>
          <div class="flex gap-3 justify-center">
            <button (click)="retryPayment()"
                    class="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">
              Try Again
            </button>
            <button (click)="showPaymentModal = false"
                    class="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RentProductComponent implements OnInit {
  product: any = null;
  rentalForm: FormGroup;
  loading = false;
  minDate = '';

  // Payment related
  showPaymentModal = false;
  selectedPaymentMethod = '';
  processingPayment = false;
  paymentSuccess = false;
  paymentFailed = false;
  paymentError = '';
  createdSubscriptionId: string | null = null;
  invoiceData: any = null;
  paymentData: any = null;

  paymentMethods = [
    { value: 'upi', label: 'UPI', icon: '📱', description: 'Google Pay, PhonePe, Paytm' },
    { value: 'card', label: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, RuPay' },
    { value: 'netbanking', label: 'Net Banking', icon: '🏦', description: 'All major banks' },
    { value: 'wallet', label: 'Digital Wallet', icon: '👛', description: 'Paytm, Amazon Pay' }
  ];

  durationTypes = [
    { value: 'daily', label: 'Daily', description: '1 Day', icon: '📅', savings: null },
    { value: 'weekly', label: 'Weekly', description: '7 Days', icon: '📆', savings: '10%' },
    { value: 'monthly', label: 'Monthly', description: '30 Days', icon: '🗓️', savings: '20%' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    private http: HttpClient,
    private toastService: ToastService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.rentalForm = this.fb.group({
      duration_type: ['daily', Validators.required],
      start_date: [this.minDate, Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadProduct(slug);
    }
  }

  loadProduct(slug: string) {
    this.productService.getProductDetail(slug).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: () => {
        this.toastService.error('Product not found');
        this.router.navigate(['/products']);
      }
    });
  }

getPrice(durationType: string): number {
  if (!this.product) return 0;

  switch (durationType) {
    case 'daily':
      return Number(this.product.daily_price);

    case 'weekly':
      return Number(
        this.product.weekly_price ??
        (this.product.daily_price * 7 * 0.9)
      );

    case 'monthly':
      return Number(
        this.product.monthly_price ??
        (this.product.daily_price * 30 * 0.8)
      );

    default:
      return Number(this.product.daily_price);
  }
}

getGSTAmount(): number {
  const base = this.getPrice(this.rentalForm.value.duration_type);
  return Number((base * 0.18).toFixed(2));
}

getSubtotal(): number {
  const base = this.getPrice(this.rentalForm.value.duration_type);
  const gst = this.getGSTAmount();
  return Number((base + gst).toFixed(2));
}

getTotalAmount(): number {
  const subtotal = this.getSubtotal();
  const deposit = Number(this.product?.security_deposit || 0);
  return Number((subtotal + deposit).toFixed(2));
}


  getDurationLabel(): string {
    const type = this.rentalForm.get('duration_type')?.value;
    const duration = this.durationTypes.find(d => d.value === type);
    return duration ? duration.label : 'Daily';
  }

  getEndDate(): Date {
    const startDate = new Date(this.rentalForm.get('start_date')?.value);
    const durationType = this.rentalForm.get('duration_type')?.value;
    let daysToAdd = durationType === 'weekly' ? 7 : durationType === 'monthly' ? 30 : 1;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + daysToAdd);
    return endDate;
  }

  submitRental() {
    if (this.rentalForm.valid && this.product) {
      this.loading = true;

      const rentalData = {
        product: this.product.id,
        duration_type: this.rentalForm.value.duration_type,
        start_date: this.rentalForm.value.start_date
      };

      this.http.post(`${environment.apiUrl}/subscriptions/create/`, rentalData).subscribe({
        next: (response: any) => {
          this.createdSubscriptionId = response.subscription.id;
          this.loading = false;
          this.showPaymentModal = true;
        },
        error: (err) => {
          this.toastService.error('Failed to create rental');
          this.loading = false;
        }
      });
    }
  }

  processPayment() {
    if (!this.selectedPaymentMethod || !this.createdSubscriptionId) return;

    this.processingPayment = true;

    const paymentData = {
      subscription_id: this.createdSubscriptionId,
      payment_method: this.selectedPaymentMethod
    };

    setTimeout(() => {
      this.http.post(`${environment.apiUrl}/payments/process/`, paymentData).subscribe({
        next: (response: any) => {
          this.processingPayment = false;
          if (response.success) {
            this.paymentSuccess = true;
            this.invoiceData = response.invoice;
            this.paymentData = response.payment;
            this.toastService.success('🎉 Payment successful!');
          } else {
            this.paymentFailed = true;
            this.paymentError = response.message || 'Payment failed. Please try again.';
          }
        },
        error: (err) => {
          this.processingPayment = false;
          this.paymentFailed = true;
          this.paymentError = 'Payment processing failed. Please try again.';
        }
      });
    }, 2000);
  }

  retryPayment() {
    this.paymentFailed = false;
    this.paymentError = '';
    this.selectedPaymentMethod = '';
  }

  viewInvoice() {
  if (this.invoiceData?.id) {
    // Close modal if any
    this.paymentSuccess = false;
    
    // Navigate to dashboard invoices tab
    this.router.navigate(['/dashboard'], { 
      queryParams: { tab: 'invoices' } 
    }).then(() => {
      this.toastService.success('Opening invoices...');
    });
  }
}

  goToDashboard() {
    this.router.navigate(['/dashboard'], { queryParams: { tab: 'rentals' } });
  }
}
