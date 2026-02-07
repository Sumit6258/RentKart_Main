import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (!authService.isLoggedIn) {
    toastService.error('Please login to access this page');
    router.navigate(['/auth/login']);
    return false;
  }

  const allowedRoles = route.data['roles'] as Array<string>;
  const userRole = authService.currentUser?.role;

  if (!userRole) {
    toastService.error('User role not found');
    router.navigate(['/']);
    return false;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    toastService.error('Access denied - insufficient permissions');
    
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'customer':
        router.navigate(['/dashboard']);
        break;
      case 'vendor':
        router.navigate(['/vendor']);
        break;
      case 'admin':
        router.navigate(['/admin-dashboard']);
        break;
      default:
        router.navigate(['/']);
    }
    return false;
  }

  return true;
};

export const customerGuard: CanActivateFn = (route, state) => {
  route.data = { ...route.data, roles: ['customer'] };
  return roleGuard(route, state);
};

export const vendorGuard: CanActivateFn = (route, state) => {
  route.data = { ...route.data, roles: ['vendor'] };
  return roleGuard(route, state);
};

export const adminGuard: CanActivateFn = (route, state) => {
  route.data = { ...route.data, roles: ['admin'] };
  return roleGuard(route, state);
};
