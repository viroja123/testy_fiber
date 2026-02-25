import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { filter } from 'rxjs';

/**
 * App (Root Component)
 * Root component that conditionally shows the navbar.
 * The navbar is hidden on auth/login pages.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <!-- Show Navbar only on authenticated pages -->
    @if (showNavbar) {
      <app-navbar></app-navbar>
    }

    <!-- Main content area -->
    <main [class.with-navbar]="showNavbar">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    main {
      min-height: 100vh;
    }

    main.with-navbar {
      min-height: calc(100vh - 70px);
      background: #f4f7f4;
    }
  `]
})
export class App {
  title = 'AgriSmart - Agriculture Management System';
  showNavbar = false;

  private router = inject(Router);

  constructor() {
    // Listen for route changes to toggle navbar visibility
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide navbar on auth pages and root redirect
      const url = event.urlAfterRedirects || event.url;
      this.showNavbar = !url.includes('/auth') && url !== '/';
    });
  }
}
