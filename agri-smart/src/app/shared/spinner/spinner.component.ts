import { Component } from '@angular/core';

/**
 * SpinnerComponent
 * Full-screen loading spinner overlay.
 * Used while data is being fetched or operations are in progress.
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div class="spinner-overlay">
      <div class="spinner-container">
        <div class="spinner-ring"></div>
        <div class="spinner-ring delay-1"></div>
        <div class="spinner-ring delay-2"></div>
        <p class="spinner-text">Loading...</p>
      </div>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner-ring {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(42, 157, 42, 0.2);
      border-top-color: #2a9d2a;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      position: absolute;
    }

    .spinner-ring.delay-1 {
      width: 35px;
      height: 35px;
      border-top-color: #4caf50;
      animation-direction: reverse;
      animation-duration: 0.8s;
    }

    .spinner-ring.delay-2 {
      width: 20px;
      height: 20px;
      border-top-color: #81c784;
      animation-duration: 0.6s;
    }

    .spinner-text {
      margin-top: 3.5rem;
      color: #ffffff;
      font-weight: 600;
      font-size: 0.95rem;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {}
