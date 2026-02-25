import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

/**
 * Auth Guard
 * Protects routes that require authentication.
 * Supports both Firebase auth and demo mode (localStorage flag).
 * Redirects unauthenticated users to the login page.
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Check for demo mode first
  const isDemoMode = localStorage.getItem('agrismart_demo_mode') === 'true';
  if (isDemoMode) {
    return true;
  }

  // Check Firebase auth
  const auth = inject(Auth);
  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/auth/login']);
        resolve(false);
      }
    });
  });
};
