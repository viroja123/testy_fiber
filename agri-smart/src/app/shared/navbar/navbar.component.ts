import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * NavbarComponent
 * Main navigation bar displayed across all authenticated pages.
 * Shows brand, navigation links, and logout button.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-primary shadow-lg">
      <div class="container-fluid">
        <!-- Brand -->
        <a class="navbar-brand d-flex align-items-center" routerLink="/dashboard">
          <span class="brand-icon me-2">🌾</span>
          <span class="brand-text">AgriSmart</span>
        </a>

        <!-- Mobile Toggle -->
        <button class="navbar-toggler border-0" type="button"
                data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
                (click)="isCollapsed = !isCollapsed">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Nav Links -->
        <div class="collapse navbar-collapse" [class.show]="isCollapsed" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active"
                 [routerLinkActiveOptions]="{exact: true}">
                <i class="nav-icon">📊</i> Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/farmers" routerLinkActive="active">
                <i class="nav-icon">👨‍🌾</i> Farmers
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/crops" routerLinkActive="active">
                <i class="nav-icon">🌱</i> Crops
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/sales" routerLinkActive="active">
                <i class="nav-icon">💰</i> Sales
              </a>
            </li>
          </ul>

          <!-- User Info & Logout -->
          <div class="d-flex align-items-center">
            <span class="text-light me-3 user-email" *ngIf="authService.currentUser$ | async as user">
              {{ user.email }}
            </span>
            <button class="btn btn-outline-light btn-sm logout-btn" (click)="onLogout()">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .bg-gradient-primary {
      background: linear-gradient(135deg, #1a5d1a 0%, #2d8e2d 50%, #3aaf3a 100%) !important;
    }

    .navbar {
      padding: 0.8rem 1rem;
      border-bottom: 3px solid rgba(255, 255, 255, 0.1);
    }

    .brand-icon {
      font-size: 1.6rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }

    .brand-text {
      font-weight: 700;
      font-size: 1.4rem;
      letter-spacing: 1px;
      background: linear-gradient(to right, #ffffff, #c8e6c9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.85) !important;
      font-weight: 500;
      padding: 0.5rem 1rem !important;
      margin: 0 0.2rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      color: #ffffff !important;
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }

    .nav-link.active {
      color: #ffffff !important;
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .nav-icon {
      margin-right: 4px;
      font-style: normal;
    }

    .user-email {
      font-size: 0.85rem;
      opacity: 0.9;
    }

    .logout-btn {
      border-radius: 20px;
      padding: 0.3rem 1rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }

    .navbar-toggler:focus {
      box-shadow: 0 0 0 0.15rem rgba(255, 255, 255, 0.3);
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  isCollapsed = false;

  /** Handle user logout */
  async onLogout() {
    try {
      // Clear demo mode flag
      localStorage.removeItem('agrismart_demo_mode');
      await this.authService.logout();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      // Even if Firebase logout fails, redirect to login
      localStorage.removeItem('agrismart_demo_mode');
      this.router.navigate(['/auth/login']);
    }
  }
}
