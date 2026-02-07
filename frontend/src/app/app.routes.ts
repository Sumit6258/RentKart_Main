import { Routes } from '@angular/router';
import { customerGuard, vendorGuard, adminGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/:slug',
    loadComponent: () => import('./features/products/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'rent/:slug',
    loadComponent: () => import('./features/rent/rent-product.component').then(m => m.RentProductComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin-login',
    loadComponent: () => import('./features/auth/admin-login.component').then(m => m.AdminLoginComponent)
  },
  
  // CUSTOMER ROUTES (Protected)
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [customerGuard]
  },
  
  // VENDOR ROUTES (Protected)
  {
    path: 'vendor',
    loadComponent: () => import('./features/vendor/vendor-dashboard.component').then(m => m.VendorDashboardComponent),
    canActivate: [vendorGuard]
  },
  
  // ADMIN ROUTES (Protected)
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  
  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
