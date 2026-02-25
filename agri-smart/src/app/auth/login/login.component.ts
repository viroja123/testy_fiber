import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

/**
 * LoginComponent
 * Provides admin login form with email/password authentication.
 * Uses reactive forms with validation.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  template: `
    <!-- Loading Spinner -->
    <app-spinner *ngIf="isLoading"></app-spinner>

    <div class="login-page">
      <!-- Animated Background Elements -->
      <div class="bg-decoration">
        <div class="floating-leaf leaf-1">🍃</div>
        <div class="floating-leaf leaf-2">🌿</div>
        <div class="floating-leaf leaf-3">🌾</div>
        <div class="floating-leaf leaf-4">🍂</div>
        <div class="floating-leaf leaf-5">🌱</div>
      </div>

      <div class="login-container">
        <!-- Left Panel - Branding -->
        <div class="brand-panel">
          <div class="brand-content">
            <div class="brand-icon-large">🌾</div>
            <h1 class="brand-title">AgriSmart</h1>
            <p class="brand-subtitle">Agriculture Management System</p>
            <div class="brand-features">
              <div class="feature-item">
                <span>📊</span> Real-time Analytics
              </div>
              <div class="feature-item">
                <span>👨‍🌾</span> Farmer Management
              </div>
              <div class="feature-item">
                <span>🌱</span> Crop Tracking
              </div>
              <div class="feature-item">
                <span>💰</span> Sales Records
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Login Form -->
        <div class="form-panel">
          <div class="form-content">
            <h2 class="form-title">Welcome Back</h2>
            <p class="form-subtitle">Sign in to your admin account</p>

            <!-- Success / Error Alerts -->
            <div class="alert alert-danger alert-dismissible fade show" *ngIf="errorMessage"
                 role="alert">
              <strong>⚠️ Error!</strong> {{ errorMessage }}
              <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
            </div>

            <!-- Login Form -->
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
              <!-- Email Input -->
              <div class="form-floating mb-3">
                <input
                  type="email"
                  class="form-control custom-input"
                  id="email"
                  formControlName="email"
                  placeholder="admin@agrismart.com"
                  [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                <label for="email">📧 Email Address</label>
                <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched">
                  Email is required
                </div>
                <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched">
                  Please enter a valid email
                </div>
              </div>

              <!-- Password Input -->
              <div class="form-floating mb-4">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  class="form-control custom-input"
                  id="password"
                  formControlName="password"
                  placeholder="Password"
                  [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <label for="password">🔒 Password</label>
                <button type="button" class="password-toggle" (click)="showPassword = !showPassword">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
                <div class="invalid-feedback" *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched">
                  Password is required
                </div>
                <div class="invalid-feedback" *ngIf="loginForm.get('password')?.errors?.['minlength'] && loginForm.get('password')?.touched">
                  Password must be at least 6 characters
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="btn btn-login w-100"
                [disabled]="loginForm.invalid || isLoading">
                <span *ngIf="!isLoading">🚀 Sign In</span>
                <span *ngIf="isLoading">
                  <span class="spinner-border spinner-border-sm me-2"></span> Signing in...
                </span>
              </button>
            </form>

            <!-- Divider -->
            <div class="divider-row">
              <hr class="divider-line"><span class="divider-text">OR</span><hr class="divider-line">
            </div>

            <!-- Demo Login Button -->
            <button class="btn btn-demo w-100" (click)="demoLogin()">
              🧪 Demo Login (Skip Firebase)
            </button>

            <div class="form-footer">
              <p>🔐 Secure admin access only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0d2818 0%, #1a472a 40%, #2d6a3e 70%, #1a5d1a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      overflow: hidden;
      position: relative;
    }

    /* Animated floating leaves */
    .bg-decoration { position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; overflow: hidden; }
    .floating-leaf { position: absolute; font-size: 2rem; opacity: 0.15; animation: floatUp linear infinite; }
    .leaf-1 { left: 10%; animation-duration: 15s; bottom: -50px; }
    .leaf-2 { left: 30%; animation-duration: 12s; animation-delay: 3s; bottom: -50px; }
    .leaf-3 { left: 55%; animation-duration: 18s; animation-delay: 5s; bottom: -50px; }
    .leaf-4 { left: 75%; animation-duration: 14s; animation-delay: 2s; bottom: -50px; }
    .leaf-5 { left: 90%; animation-duration: 16s; animation-delay: 7s; bottom: -50px; }

    @keyframes floatUp {
      0% { transform: translateY(0) rotate(0deg); opacity: 0; }
      10% { opacity: 0.15; }
      90% { opacity: 0.15; }
      100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }

    .login-container {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      max-width: 900px;
      width: 100%;
      min-height: 550px;
      position: relative;
      z-index: 1;
    }

    /* Brand Panel (Left Side) */
    .brand-panel {
      flex: 1;
      background: linear-gradient(145deg, rgba(42, 157, 42, 0.3), rgba(26, 93, 26, 0.5));
      padding: 3rem 2.5rem;
      display: flex;
      align-items: center;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
    }

    .brand-content { text-align: center; width: 100%; }

    .brand-icon-large {
      font-size: 4rem;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .brand-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0.5rem 0 0.3rem;
      letter-spacing: 2px;
    }

    .brand-subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.95rem;
      margin-bottom: 2rem;
    }

    .brand-features {
      text-align: left;
      display: inline-block;
    }

    .feature-item {
      color: rgba(255, 255, 255, 0.8);
      padding: 0.5rem 0;
      font-size: 0.9rem;
      transition: transform 0.3s;
    }

    .feature-item:hover {
      transform: translateX(5px);
      color: #ffffff;
    }

    .feature-item span { margin-right: 8px; }

    /* Form Panel (Right Side) */
    .form-panel {
      flex: 1;
      padding: 3rem 2.5rem;
      display: flex;
      align-items: center;
    }

    .form-content { width: 100%; }

    .form-title {
      color: #ffffff;
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.3rem;
    }

    .form-subtitle {
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }

    /* Custom Form Inputs */
    .custom-input {
      background: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      color: #ffffff !important;
      border-radius: 12px !important;
      padding: 1rem 0.75rem !important;
      height: auto !important;
      transition: all 0.3s ease;
    }

    .custom-input:focus {
      background: rgba(255, 255, 255, 0.12) !important;
      border-color: #4caf50 !important;
      box-shadow: 0 0 0 0.2rem rgba(76, 175, 80, 0.25) !important;
    }

    .form-floating label {
      color: rgba(255, 255, 255, 0.5) !important;
    }

    .form-floating > .form-control:focus ~ label,
    .form-floating > .form-control:not(:placeholder-shown) ~ label {
      color: #81c784 !important;
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      z-index: 5;
      padding: 4px;
    }

    /* Login Button */
    .btn-login {
      background: linear-gradient(135deg, #2e7d32, #4caf50) !important;
      color: #ffffff !important;
      border: none;
      border-radius: 12px;
      padding: 0.8rem;
      font-size: 1.05rem;
      font-weight: 600;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(46, 125, 50, 0.4);
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(46, 125, 50, 0.6);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Divider */
    .divider-row {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin: 1.2rem 0;
    }
    .divider-line {
      flex: 1;
      border: none;
      border-top: 1px solid rgba(255,255,255,0.15);
      margin: 0;
    }
    .divider-text {
      color: rgba(255,255,255,0.4);
      font-size: 0.8rem;
      font-weight: 600;
    }

    /* Demo Login Button */
    .btn-demo {
      background: rgba(255, 255, 255, 0.1) !important;
      color: #ffffff !important;
      border: 1px dashed rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      padding: 0.7rem;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    .btn-demo:hover {
      background: rgba(255, 255, 255, 0.18) !important;
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-1px);
    }

    .form-footer {
      text-align: center;
      margin-top: 1.5rem;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.8rem;
    }

    /* Alert Styling */
    .alert-danger {
      background: rgba(211, 47, 47, 0.15) !important;
      border: 1px solid rgba(211, 47, 47, 0.3) !important;
      color: #ef9a9a !important;
      border-radius: 12px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
        min-height: auto;
      }
      .brand-panel {
        padding: 2rem;
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .brand-features { display: none; }
      .form-panel { padding: 2rem; }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  /** Login form with email and password validators */
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  showPassword = false;
  errorMessage = '';

  /**
   * Handle form submission
   * Attempts to sign in the user with Firebase Auth
   */
  async onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      // Map Firebase error codes to user-friendly messages
      switch (error.code) {
        case 'auth/user-not-found':
          this.errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'Invalid email address format.';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          this.errorMessage = 'Login failed. Please check your credentials.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Demo login - bypasses Firebase auth for testing.
   * Sets a flag in localStorage and navigates to dashboard.
   */
  demoLogin() {
    localStorage.setItem('agrismart_demo_mode', 'true');
    this.router.navigate(['/dashboard']);
  }
}
