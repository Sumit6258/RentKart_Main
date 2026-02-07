import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div *ngFor="let toast of toastService.toasts" 
           [ngClass]="{
             'bg-green-500': toast.type === 'success',
             'bg-red-500': toast.type === 'error',
             'bg-blue-500': toast.type === 'info',
             'bg-yellow-500': toast.type === 'warning'
           }"
           class="px-6 py-4 rounded-lg shadow-lg text-white font-semibold min-w-[300px] animate-slide-in flex items-center justify-between">
        <span>{{ toast.message }}</span>
        <button (click)="toastService.remove(toast)" 
                class="ml-4 text-white hover:text-gray-200 font-bold">
          ✕
        </button>
      </div>
    </div>
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
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
