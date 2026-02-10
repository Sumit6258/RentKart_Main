import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (!authService.isLoggedIn) {
    toastService.error('Please login to access admin panel');
    router.navigate(['/login']);
    return false;
  }

  const user = authService.currentUser;
  
  if (user?.role !== 'admin' && !user?.is_superuser) {
    toastService.error('Access denied - Admins only');
    authService.logout();
    return false;
  }

  return true;
};
