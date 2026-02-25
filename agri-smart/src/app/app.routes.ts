import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

/**
 * Application Routes
 * Uses lazy loading for each module.
 * Protected routes use the authGuard to ensure authentication.
 */
export const routes: Routes = [
  // Auth routes (public)
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Dashboard (protected)
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard]
  },

  // Farmer Management (protected)
  {
    path: 'farmers',
    loadChildren: () => import('./farmers/farmers.routes').then(m => m.FARMER_ROUTES),
    canActivate: [authGuard]
  },

  // Crop Management (protected)
  {
    path: 'crops',
    loadChildren: () => import('./crops/crops.routes').then(m => m.CROP_ROUTES),
    canActivate: [authGuard]
  },

  // Sales Management (protected)
  {
    path: 'sales',
    loadChildren: () => import('./sales/sales.routes').then(m => m.SALE_ROUTES),
    canActivate: [authGuard]
  },

  // Default redirect
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // Wildcard - redirect to login
  { path: '**', redirectTo: 'auth/login' }
];
