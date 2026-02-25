import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

/**
 * Auth Module Routes
 * Defines routing for authentication-related components.
 */
export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
