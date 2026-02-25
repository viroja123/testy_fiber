import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CropService } from '../../services/crop.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

/**
 * CropFormComponent
 * Shared form for adding and editing crops.
 * Detects edit mode via route params.
 */
@Component({
  selector: 'app-crop-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  template: `
    <app-spinner *ngIf="isLoading"></app-spinner>

    <div class="form-container">
      <button class="btn-back" (click)="goBack()">← Back to Crops</button>

      <div class="form-card">
        <div class="form-card-header crop-header">
          <h2>{{ isEditMode ? '✏️ Edit Crop' : '➕ Add New Crop' }}</h2>
          <p>{{ isEditMode ? 'Update the crop details below' : 'Enter crop information' }}</p>
        </div>

        <!-- Alerts -->
        <div class="alert alert-success alert-custom" *ngIf="successMessage">✅ {{ successMessage }}</div>
        <div class="alert alert-danger alert-custom" *ngIf="errorMessage">❌ {{ errorMessage }}</div>

        <form [formGroup]="cropForm" (ngSubmit)="onSubmit()" class="crop-form">
          <!-- Crop Name -->
          <div class="form-group">
            <label for="cropName" class="form-label">🌾 Crop Name</label>
            <input type="text" class="form-control custom-input" id="cropName"
                   formControlName="cropName" placeholder="Enter crop name"
                   [class.is-invalid]="cropForm.get('cropName')?.invalid && cropForm.get('cropName')?.touched">
            <div class="invalid-feedback" *ngIf="cropForm.get('cropName')?.errors?.['required'] && cropForm.get('cropName')?.touched">
              Crop name is required
            </div>
          </div>

          <!-- Type & Season Row -->
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="type" class="form-label">📋 Crop Type</label>
                <select class="form-control custom-input" id="type" formControlName="type"
                        [class.is-invalid]="cropForm.get('type')?.invalid && cropForm.get('type')?.touched">
                  <option value="">Select type</option>
                  <option *ngFor="let t of cropTypes" [value]="t">{{ t }}</option>
                </select>
                <div class="invalid-feedback" *ngIf="cropForm.get('type')?.errors?.['required'] && cropForm.get('type')?.touched">
                  Crop type is required
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="season" class="form-label">🗓️ Season</label>
                <select class="form-control custom-input" id="season" formControlName="season"
                        [class.is-invalid]="cropForm.get('season')?.invalid && cropForm.get('season')?.touched">
                  <option value="">Select season</option>
                  <option value="Kharif">☀️ Kharif</option>
                  <option value="Rabi">❄️ Rabi</option>
                  <option value="Zaid">🌤️ Zaid</option>
                </select>
                <div class="invalid-feedback" *ngIf="cropForm.get('season')?.errors?.['required'] && cropForm.get('season')?.touched">
                  Season is required
                </div>
              </div>
            </div>
          </div>

          <!-- Quantity & Price Row -->
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="quantity" class="form-label">📦 Quantity (kg)</label>
                <input type="number" class="form-control custom-input" id="quantity"
                       formControlName="quantity" placeholder="Enter quantity" min="0"
                       [class.is-invalid]="cropForm.get('quantity')?.invalid && cropForm.get('quantity')?.touched">
                <div class="invalid-feedback" *ngIf="cropForm.get('quantity')?.errors?.['required'] && cropForm.get('quantity')?.touched">
                  Quantity is required
                </div>
                <div class="invalid-feedback" *ngIf="cropForm.get('quantity')?.errors?.['min'] && cropForm.get('quantity')?.touched">
                  Quantity must be positive
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="price" class="form-label">💰 Price per kg (₹)</label>
                <input type="number" class="form-control custom-input" id="price"
                       formControlName="price" placeholder="Enter price per kg" min="0" step="0.01"
                       [class.is-invalid]="cropForm.get('price')?.invalid && cropForm.get('price')?.touched">
                <div class="invalid-feedback" *ngIf="cropForm.get('price')?.errors?.['required'] && cropForm.get('price')?.touched">
                  Price is required
                </div>
                <div class="invalid-feedback" *ngIf="cropForm.get('price')?.errors?.['min'] && cropForm.get('price')?.touched">
                  Price must be positive
                </div>
              </div>
            </div>
          </div>

          <!-- Total Value Preview -->
          <div class="total-preview" *ngIf="cropForm.get('quantity')?.value && cropForm.get('price')?.value">
            <span class="total-label">📊 Estimated Total Value:</span>
            <span class="total-value">₹{{ cropForm.get('quantity')?.value * cropForm.get('price')?.value | number:'1.0-2' }}</span>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn btn-cancel" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-submit" [disabled]="cropForm.invalid || isSubmitting">
              <span *ngIf="!isSubmitting">{{ isEditMode ? '💾 Update Crop' : '➕ Add Crop' }}</span>
              <span *ngIf="isSubmitting"><span class="spinner-border spinner-border-sm me-2"></span> Saving...</span>
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
      cursor: pointer; font-size: 0.95rem; padding: 0.5rem 0; margin-bottom: 1rem;
      display: inline-block; transition: color 0.3s;
    }
    .btn-back:hover { color: #1b5e20; }

    .form-card {
      background: #fff; border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e8ede9; overflow: hidden;
    }

    .crop-header {
      background: linear-gradient(135deg, #0d47a1, #1976d2);
      padding: 1.5rem 2rem; color: white;
    }
    .crop-header h2 { font-weight: 700; margin-bottom: 0.3rem; font-size: 1.4rem; }
    .crop-header p { opacity: 0.8; margin: 0; font-size: 0.9rem; }

    .crop-form { padding: 2rem; }
    .form-group { margin-bottom: 1.5rem; }
    .form-label { font-weight: 600; color: #333; margin-bottom: 0.4rem; display: block; font-size: 0.9rem; }

    .custom-input {
      border: 2px solid #e0e0e0; border-radius: 12px; padding: 0.7rem 1rem;
      font-size: 0.95rem; transition: all 0.3s; background: #fafafa;
    }
    .custom-input:focus { border-color: #1976d2; box-shadow: 0 0 0 0.2rem rgba(25,118,210,0.15); background: #fff; }

    .alert-custom { margin: 1rem 2rem 0; border-radius: 12px; font-weight: 500; border: none; }
    .alert-success { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .alert-danger { background: #fce4ec !important; color: #c62828 !important; }

    .total-preview {
      background: linear-gradient(135deg, #e8f5e9, #c8e6c9); border-radius: 12px;
      padding: 1rem 1.25rem; display: flex; justify-content: space-between;
      align-items: center; margin-bottom: 1.5rem;
    }
    .total-label { font-weight: 600; color: #2e7d32; font-size: 0.9rem; }
    .total-value { font-weight: 800; color: #1b5e20; font-size: 1.2rem; }

    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
    .btn-cancel {
      padding: 0.6rem 1.5rem; border-radius: 12px; border: 2px solid #e0e0e0;
      background: #fff; font-weight: 600; cursor: pointer;
    }
    .btn-submit {
      padding: 0.6rem 2rem; border-radius: 12px; border: none;
      background: linear-gradient(135deg, #0d47a1, #1976d2); color: white;
      font-weight: 600; cursor: pointer; transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(25,118,210,0.3);
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(25,118,210,0.4); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

    @media (max-width: 768px) { .form-container { padding: 1rem; } .crop-form { padding: 1.5rem; } }
  `]
})
export class CropFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cropService = inject(CropService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  cropId = '';
  isLoading = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  /** Available crop types */
  cropTypes = ['Grain', 'Vegetable', 'Fruit', 'Pulse', 'Oilseed', 'Spice', 'Fiber', 'Other'];

  /** Crop form with validation rules */
  cropForm: FormGroup = this.fb.group({
    cropName: ['', Validators.required],
    type: ['', Validators.required],
    season: ['', Validators.required],
    quantity: [null, [Validators.required, Validators.min(1)]],
    price: [null, [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit(): void {
    this.cropId = this.route.snapshot.params['id'];
    if (this.cropId) {
      this.isEditMode = true;
      this.loadCrop();
    }
  }

  private loadCrop(): void {
    this.isLoading = true;
    this.cropService.getCropById(this.cropId).subscribe({
      next: (crop) => {
        if (crop) {
          this.cropForm.patchValue({
            cropName: crop.cropName,
            type: crop.type,
            season: crop.season,
            quantity: crop.quantity,
            price: crop.price
          });
        }
        this.isLoading = false;
      },
      error: () => { this.errorMessage = 'Failed to load crop data.'; this.isLoading = false; }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.cropForm.invalid) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      if (this.isEditMode) {
        await this.cropService.updateCrop(this.cropId, this.cropForm.value);
        this.successMessage = 'Crop updated successfully!';
      } else {
        await this.cropService.addCrop(this.cropForm.value);
        this.successMessage = 'Crop added successfully!';
      }
      setTimeout(() => this.router.navigate(['/crops']), 1500);
    } catch (error) {
      this.errorMessage = 'Failed to save crop.';
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack(): void { this.router.navigate(['/crops']); }
}
