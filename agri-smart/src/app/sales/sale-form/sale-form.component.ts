import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SaleService } from '../../services/sale.service';
import { FarmerService } from '../../services/farmer.service';
import { CropService } from '../../services/crop.service';
import { Farmer } from '../../models/farmer.model';
import { Crop } from '../../models/crop.model';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

/**
 * SaleFormComponent
 * Shared form for adding and editing sale records.
 * Loads farmer and crop lists for dropdown selections.
 */
@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  template: `
    <app-spinner *ngIf="isLoading"></app-spinner>

    <div class="form-container">
      <button class="btn-back" (click)="goBack()">← Back to Sales</button>

      <div class="form-card">
        <div class="form-card-header sale-header">
          <h2>{{ isEditMode ? '✏️ Edit Sale Record' : '➕ Record New Sale' }}</h2>
          <p>{{ isEditMode ? 'Update the sale details below' : 'Enter sale transaction details' }}</p>
        </div>

        <!-- Alerts -->
        <div class="alert alert-success alert-custom" *ngIf="successMessage">✅ {{ successMessage }}</div>
        <div class="alert alert-danger alert-custom" *ngIf="errorMessage">❌ {{ errorMessage }}</div>

        <form [formGroup]="saleForm" (ngSubmit)="onSubmit()" class="sale-form">
          <!-- Farmer & Crop Row -->
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="farmerName" class="form-label">👨‍🌾 Farmer Name</label>
                <select class="form-control custom-input" id="farmerName" formControlName="farmerName"
                        [class.is-invalid]="saleForm.get('farmerName')?.invalid && saleForm.get('farmerName')?.touched">
                  <option value="">Select farmer</option>
                  <option *ngFor="let farmer of farmers" [value]="farmer.name">{{ farmer.name }}</option>
                </select>
                <div class="invalid-feedback" *ngIf="saleForm.get('farmerName')?.errors?.['required'] && saleForm.get('farmerName')?.touched">
                  Farmer is required
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="cropName" class="form-label">🌾 Crop Name</label>
                <select class="form-control custom-input" id="cropName" formControlName="cropName"
                        [class.is-invalid]="saleForm.get('cropName')?.invalid && saleForm.get('cropName')?.touched">
                  <option value="">Select crop</option>
                  <option *ngFor="let crop of crops" [value]="crop.cropName">{{ crop.cropName }}</option>
                </select>
                <div class="invalid-feedback" *ngIf="saleForm.get('cropName')?.errors?.['required'] && saleForm.get('cropName')?.touched">
                  Crop is required
                </div>
              </div>
            </div>
          </div>

          <!-- Quantity & Price Row -->
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="quantitySold" class="form-label">📦 Quantity Sold (kg)</label>
                <input type="number" class="form-control custom-input" id="quantitySold"
                       formControlName="quantitySold" placeholder="Enter quantity" min="0"
                       [class.is-invalid]="saleForm.get('quantitySold')?.invalid && saleForm.get('quantitySold')?.touched">
                <div class="invalid-feedback" *ngIf="saleForm.get('quantitySold')?.errors?.['required'] && saleForm.get('quantitySold')?.touched">
                  Quantity is required
                </div>
                <div class="invalid-feedback" *ngIf="saleForm.get('quantitySold')?.errors?.['min'] && saleForm.get('quantitySold')?.touched">
                  Quantity must be positive
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="totalPrice" class="form-label">💰 Total Price (₹)</label>
                <input type="number" class="form-control custom-input" id="totalPrice"
                       formControlName="totalPrice" placeholder="Enter total price" min="0" step="0.01"
                       [class.is-invalid]="saleForm.get('totalPrice')?.invalid && saleForm.get('totalPrice')?.touched">
                <div class="invalid-feedback" *ngIf="saleForm.get('totalPrice')?.errors?.['required'] && saleForm.get('totalPrice')?.touched">
                  Total price is required
                </div>
                <div class="invalid-feedback" *ngIf="saleForm.get('totalPrice')?.errors?.['min'] && saleForm.get('totalPrice')?.touched">
                  Price must be positive
                </div>
              </div>
            </div>
          </div>

          <!-- Date -->
          <div class="form-group">
            <label for="date" class="form-label">📅 Sale Date</label>
            <input type="date" class="form-control custom-input" id="date"
                   formControlName="date"
                   [class.is-invalid]="saleForm.get('date')?.invalid && saleForm.get('date')?.touched">
            <div class="invalid-feedback" *ngIf="saleForm.get('date')?.errors?.['required'] && saleForm.get('date')?.touched">
              Sale date is required
            </div>
          </div>

          <!-- Sale Summary Preview -->
          <div class="sale-preview" *ngIf="saleForm.get('farmerName')?.value && saleForm.get('cropName')?.value && saleForm.get('totalPrice')?.value">
            <h6>📋 Sale Summary</h6>
            <div class="preview-row">
              <span>Farmer:</span>
              <strong>{{ saleForm.get('farmerName')?.value }}</strong>
            </div>
            <div class="preview-row">
              <span>Crop:</span>
              <strong>{{ saleForm.get('cropName')?.value }}</strong>
            </div>
            <div class="preview-row">
              <span>Qty × Price:</span>
              <strong>{{ saleForm.get('quantitySold')?.value }} kg → ₹{{ saleForm.get('totalPrice')?.value | number:'1.0-2' }}</strong>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn btn-cancel" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-submit" [disabled]="saleForm.invalid || isSubmitting">
              <span *ngIf="!isSubmitting">{{ isEditMode ? '💾 Update Sale' : '➕ Record Sale' }}</span>
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
      background: none; border: none; color: #e65100; font-weight: 600;
      cursor: pointer; font-size: 0.95rem; padding: 0.5rem 0; margin-bottom: 1rem;
      display: inline-block;
    }
    .btn-back:hover { color: #bf360c; }

    .form-card {
      background: #fff; border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e8ede9; overflow: hidden;
    }

    .sale-header {
      background: linear-gradient(135deg, #e65100, #f57c00);
      padding: 1.5rem 2rem; color: white;
    }
    .sale-header h2 { font-weight: 700; margin-bottom: 0.3rem; font-size: 1.4rem; }
    .sale-header p { opacity: 0.8; margin: 0; font-size: 0.9rem; }

    .sale-form { padding: 2rem; }
    .form-group { margin-bottom: 1.5rem; }
    .form-label { font-weight: 600; color: #333; margin-bottom: 0.4rem; display: block; font-size: 0.9rem; }

    .custom-input {
      border: 2px solid #e0e0e0; border-radius: 12px; padding: 0.7rem 1rem;
      font-size: 0.95rem; transition: all 0.3s; background: #fafafa;
    }
    .custom-input:focus { border-color: #f57c00; box-shadow: 0 0 0 0.2rem rgba(245,124,0,0.15); background: #fff; }

    .alert-custom { margin: 1rem 2rem 0; border-radius: 12px; font-weight: 500; border: none; }
    .alert-success { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .alert-danger { background: #fce4ec !important; color: #c62828 !important; }

    /* Sale Preview */
    .sale-preview {
      background: linear-gradient(135deg, #fff3e0, #ffe0b2); border-radius: 12px;
      padding: 1rem 1.25rem; margin-bottom: 1.5rem;
    }
    .sale-preview h6 { font-weight: 700; color: #e65100; margin-bottom: 0.6rem; }
    .preview-row {
      display: flex; justify-content: space-between; padding: 0.3rem 0;
      font-size: 0.85rem;
    }
    .preview-row span { color: #795548; }
    .preview-row strong { color: #e65100; }

    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
    .btn-cancel {
      padding: 0.6rem 1.5rem; border-radius: 12px; border: 2px solid #e0e0e0;
      background: #fff; font-weight: 600; cursor: pointer;
    }
    .btn-submit {
      padding: 0.6rem 2rem; border-radius: 12px; border: none;
      background: linear-gradient(135deg, #e65100, #f57c00); color: white;
      font-weight: 600; cursor: pointer; transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(230,81,0,0.3);
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(230,81,0,0.4); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

    @media (max-width: 768px) { .form-container { padding: 1rem; } .sale-form { padding: 1.5rem; } }
  `]
})
export class SaleFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private saleService = inject(SaleService);
  private farmerService = inject(FarmerService);
  private cropService = inject(CropService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  saleId = '';
  isLoading = true;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  /** Dropdowns populated from Firestore */
  farmers: Farmer[] = [];
  crops: Crop[] = [];

  /** Sale form with validation */
  saleForm: FormGroup = this.fb.group({
    farmerName: ['', Validators.required],
    cropName: ['', Validators.required],
    quantitySold: [null, [Validators.required, Validators.min(1)]],
    totalPrice: [null, [Validators.required, Validators.min(0.01)]],
    date: ['', Validators.required]
  });

  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.loadDropdowns();
    this.saleId = this.route.snapshot.params['id'];
    if (this.saleId) {
      this.isEditMode = true;
      this.loadSale();
    }
  }

  ngOnDestroy(): void { this.subs.forEach(s => s.unsubscribe()); }

  /** Load farmer and crop lists for dropdown options */
  private loadDropdowns(): void {
    let loaded = 0;
    const checkDone = () => { loaded++; if (loaded >= 2 && !this.isEditMode) this.isLoading = false; };

    this.subs.push(
      this.farmerService.getFarmers().subscribe({ next: (d) => { this.farmers = d; checkDone(); }, error: () => checkDone() })
    );
    this.subs.push(
      this.cropService.getCrops().subscribe({ next: (d) => { this.crops = d; checkDone(); }, error: () => checkDone() })
    );
  }

  private loadSale(): void {
    this.saleService.getSaleById(this.saleId).subscribe({
      next: (sale) => {
        if (sale) {
          this.saleForm.patchValue({
            farmerName: sale.farmerName,
            cropName: sale.cropName,
            quantitySold: sale.quantitySold,
            totalPrice: sale.totalPrice,
            date: sale.date
          });
        }
        this.isLoading = false;
      },
      error: () => { this.errorMessage = 'Failed to load sale data.'; this.isLoading = false; }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.saleForm.invalid) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      if (this.isEditMode) {
        await this.saleService.updateSale(this.saleId, this.saleForm.value);
        this.successMessage = 'Sale record updated successfully!';
      } else {
        await this.saleService.addSale(this.saleForm.value);
        this.successMessage = 'Sale recorded successfully!';
      }
      setTimeout(() => this.router.navigate(['/sales']), 1500);
    } catch (error) {
      this.errorMessage = 'Failed to save sale record.';
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack(): void { this.router.navigate(['/sales']); }
}
