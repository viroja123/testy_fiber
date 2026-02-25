import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FarmerService } from '../../services/farmer.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

/**
 * FarmerFormComponent
 * Shared form for adding and editing farmers.
 * Detects edit mode via route params and pre-fills the form accordingly.
 */
@Component({
  selector: 'app-farmer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  template: `
    <app-spinner *ngIf="isLoading"></app-spinner>

    <div class="form-container">
      <!-- Back Button -->
      <button class="btn-back" (click)="goBack()">← Back to Farmers</button>

      <div class="form-card">
        <div class="form-card-header">
          <h2>{{ isEditMode ? '✏️ Edit Farmer' : '➕ Add New Farmer' }}</h2>
          <p>{{ isEditMode ? 'Update the farmer details below' : 'Fill in the farmer\'s information' }}</p>
        </div>

        <!-- Success/Error Alerts -->
        <div class="alert alert-success alert-custom" *ngIf="successMessage">
          ✅ {{ successMessage }}
        </div>
        <div class="alert alert-danger alert-custom" *ngIf="errorMessage">
          ❌ {{ errorMessage }}
        </div>

        <!-- Farmer Form -->
        <form [formGroup]="farmerForm" (ngSubmit)="onSubmit()" class="farmer-form">
          <!-- Name -->
          <div class="form-group">
            <label for="name" class="form-label">👤 Full Name</label>
            <input
              type="text"
              class="form-control custom-input"
              id="name"
              formControlName="name"
              placeholder="Enter farmer's full name"
              [class.is-invalid]="farmerForm.get('name')?.invalid && farmerForm.get('name')?.touched">
            <div class="invalid-feedback" *ngIf="farmerForm.get('name')?.errors?.['required'] && farmerForm.get('name')?.touched">
              Name is required
            </div>
            <div class="invalid-feedback" *ngIf="farmerForm.get('name')?.errors?.['minlength'] && farmerForm.get('name')?.touched">
              Name must be at least 2 characters
            </div>
          </div>

          <!-- Phone -->
          <div class="form-group">
            <label for="phone" class="form-label">📱 Phone Number</label>
            <input
              type="tel"
              class="form-control custom-input"
              id="phone"
              formControlName="phone"
              placeholder="Enter 10-digit phone number"
              [class.is-invalid]="farmerForm.get('phone')?.invalid && farmerForm.get('phone')?.touched">
            <div class="invalid-feedback" *ngIf="farmerForm.get('phone')?.errors?.['required'] && farmerForm.get('phone')?.touched">
              Phone number is required
            </div>
            <div class="invalid-feedback" *ngIf="farmerForm.get('phone')?.errors?.['pattern'] && farmerForm.get('phone')?.touched">
              Please enter a valid 10-digit phone number
            </div>
          </div>

          <!-- Address -->
          <div class="form-group">
            <label for="address" class="form-label">📍 Address</label>
            <textarea
              class="form-control custom-input"
              id="address"
              formControlName="address"
              rows="3"
              placeholder="Enter full address"
              [class.is-invalid]="farmerForm.get('address')?.invalid && farmerForm.get('address')?.touched"></textarea>
            <div class="invalid-feedback" *ngIf="farmerForm.get('address')?.errors?.['required'] && farmerForm.get('address')?.touched">
              Address is required
            </div>
          </div>

          <!-- Land Area -->
          <div class="form-group">
            <label for="landArea" class="form-label">🏞️ Land Area (acres)</label>
            <input
              type="number"
              class="form-control custom-input"
              id="landArea"
              formControlName="landArea"
              placeholder="Enter land area in acres"
              min="0"
              step="0.1"
              [class.is-invalid]="farmerForm.get('landArea')?.invalid && farmerForm.get('landArea')?.touched">
            <div class="invalid-feedback" *ngIf="farmerForm.get('landArea')?.errors?.['required'] && farmerForm.get('landArea')?.touched">
              Land area is required
            </div>
            <div class="invalid-feedback" *ngIf="farmerForm.get('landArea')?.errors?.['min'] && farmerForm.get('landArea')?.touched">
              Land area must be positive
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="form-actions">
            <button type="button" class="btn btn-cancel" (click)="goBack()">Cancel</button>
            <button
              type="submit"
              class="btn btn-submit"
              [disabled]="farmerForm.invalid || isSubmitting">
              <span *ngIf="!isSubmitting">{{ isEditMode ? '💾 Update Farmer' : '➕ Add Farmer' }}</span>
              <span *ngIf="isSubmitting">
                <span class="spinner-border spinner-border-sm me-2"></span> Saving...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-container { padding: 1.5rem; max-width: 700px; margin: 0 auto; }

    .btn-back {
      background: none; border: none; color: #2e7d32; font-weight: 600;
      cursor: pointer; font-size: 0.95rem; padding: 0.5rem 0;
      margin-bottom: 1rem; display: inline-block; transition: color 0.3s;
    }
    .btn-back:hover { color: #1b5e20; }

    .form-card {
      background: #fff; border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e8ede9;
      overflow: hidden;
    }

    .form-card-header {
      background: linear-gradient(135deg, #1a472a, #2e7d32);
      padding: 1.5rem 2rem; color: white;
    }
    .form-card-header h2 { font-weight: 700; margin-bottom: 0.3rem; font-size: 1.4rem; }
    .form-card-header p { opacity: 0.8; margin: 0; font-size: 0.9rem; }

    .farmer-form { padding: 2rem; }

    .form-group { margin-bottom: 1.5rem; }

    .form-label {
      font-weight: 600; color: #333; margin-bottom: 0.4rem;
      display: block; font-size: 0.9rem;
    }

    .custom-input {
      border: 2px solid #e0e0e0; border-radius: 12px;
      padding: 0.7rem 1rem; font-size: 0.95rem;
      transition: all 0.3s; background: #fafafa;
    }
    .custom-input:focus {
      border-color: #4caf50; box-shadow: 0 0 0 0.2rem rgba(76,175,80,0.15);
      background: #fff;
    }

    .alert-custom { margin: 1rem 2rem 0; border-radius: 12px; font-weight: 500; border: none; }
    .alert-success { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .alert-danger { background: #fce4ec !important; color: #c62828 !important; }

    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }

    .btn-cancel {
      padding: 0.6rem 1.5rem; border-radius: 12px; border: 2px solid #e0e0e0;
      background: #fff; font-weight: 600; cursor: pointer; transition: all 0.3s;
    }
    .btn-cancel:hover { background: #f5f5f5; }

    .btn-submit {
      padding: 0.6rem 2rem; border-radius: 12px; border: none;
      background: linear-gradient(135deg, #2e7d32, #4caf50); color: white;
      font-weight: 600; cursor: pointer; transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(46,125,50,0.3);
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(46,125,50,0.4); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

    @media (max-width: 768px) { .form-container { padding: 1rem; } .farmer-form { padding: 1.5rem; } }
  `]
})
export class FarmerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private farmerService = inject(FarmerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  farmerId = '';
  isLoading = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  /** Farmer form with validation rules */
  farmerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    address: ['', Validators.required],
    landArea: [null, [Validators.required, Validators.min(0.1)]]
  });

  ngOnInit(): void {
    // Check if we're in edit mode by looking at route params
    this.farmerId = this.route.snapshot.params['id'];
    if (this.farmerId) {
      this.isEditMode = true;
      this.loadFarmer();
    }
  }

  /** Load existing farmer data for editing */
  private loadFarmer(): void {
    this.isLoading = true;
    this.farmerService.getFarmerById(this.farmerId).subscribe({
      next: (farmer) => {
        if (farmer) {
          this.farmerForm.patchValue({
            name: farmer.name,
            phone: farmer.phone,
            address: farmer.address,
            landArea: farmer.landArea
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load farmer data.';
        this.isLoading = false;
        console.error('Load error:', err);
      }
    });
  }

  /** Handle form submission (add or update) */
  async onSubmit(): Promise<void> {
    if (this.farmerForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      if (this.isEditMode) {
        await this.farmerService.updateFarmer(this.farmerId, this.farmerForm.value);
        this.successMessage = 'Farmer updated successfully!';
      } else {
        await this.farmerService.addFarmer(this.farmerForm.value);
        this.successMessage = 'Farmer added successfully!';
      }

      // Navigate back after short delay
      setTimeout(() => this.router.navigate(['/farmers']), 1500);
    } catch (error) {
      this.errorMessage = 'Failed to save farmer. Please try again.';
      console.error('Save error:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  /** Navigate back to farmer list */
  goBack(): void {
    this.router.navigate(['/farmers']);
  }
}
