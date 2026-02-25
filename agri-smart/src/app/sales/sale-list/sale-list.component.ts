import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../models/sale.model';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

/**
 * SaleListComponent
 * Displays a searchable list of all sales records with CRUD actions.
 */
@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  template: `
    <app-spinner *ngIf="isLoading"></app-spinner>

    <div class="list-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">💰 Sales Management</h1>
          <p class="page-subtitle">Track all crop sale records</p>
        </div>
        <a routerLink="/sales/add" class="btn btn-add">
          ➕ Record New Sale
        </a>
      </div>

      <!-- Search & Summary -->
      <div class="filter-section">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="search-input"
            placeholder="Search by farmer, crop, or date..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterSales()">
          <button class="search-clear" *ngIf="searchTerm" (click)="searchTerm = ''; filterSales()">✕</button>
        </div>

        <!-- Summary Bar -->
        <div class="summary-bar">
          <div class="summary-item">
            <span class="summary-label">Total Sales:</span>
            <span class="summary-value">{{ filteredSales.length }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Revenue:</span>
            <span class="summary-value revenue">₹{{ totalFilteredRevenue | number:'1.0-0' }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Qty Sold:</span>
            <span class="summary-value">{{ totalFilteredQty | number:'1.0-0' }} kg</span>
          </div>
        </div>
      </div>

      <!-- Alerts -->
      <div class="alert alert-success alert-custom" *ngIf="successMessage">
        ✅ {{ successMessage }}
        <button type="button" class="btn-close" (click)="successMessage = ''"></button>
      </div>
      <div class="alert alert-danger alert-custom" *ngIf="errorMessage">
        ❌ {{ errorMessage }}
        <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
      </div>

      <!-- Sales Table -->
      <div class="table-card" *ngIf="filteredSales.length > 0">
        <div class="table-responsive">
          <table class="table table-custom">
            <thead>
              <tr>
                <th>#</th>
                <th>Farmer</th>
                <th>Crop</th>
                <th>Qty Sold (kg)</th>
                <th>Total Price (₹)</th>
                <th>Date</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let sale of filteredSales; let i = index" class="table-row-animate">
                <td><span class="row-number">{{ i + 1 }}</span></td>
                <td>
                  <div class="name-cell">
                    <div class="avatar sale-avatar">{{ sale.farmerName?.charAt(0)?.toUpperCase() }}</div>
                    <span class="name-text">{{ sale.farmerName }}</span>
                  </div>
                </td>
                <td><span class="crop-badge">🌾 {{ sale.cropName }}</span></td>
                <td><span class="qty-text">{{ sale.quantitySold }} kg</span></td>
                <td><span class="price-badge">₹{{ sale.totalPrice | number:'1.0-0' }}</span></td>
                <td><span class="date-text">📅 {{ sale.date }}</span></td>
                <td class="text-center">
                  <div class="action-btns">
                    <a [routerLink]="['/sales/edit', sale.id]" class="btn btn-action btn-edit" title="Edit">✏️</a>
                    <button class="btn btn-action btn-delete" title="Delete" (click)="onDelete(sale)">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="filteredSales.length === 0 && !isLoading">
        <div class="empty-icon">💰</div>
        <h3>No Sales Found</h3>
        <p *ngIf="searchTerm">No sales match your search.</p>
        <p *ngIf="!searchTerm">Start recording crop sales.</p>
        <a routerLink="/sales/add" class="btn btn-add" *ngIf="!searchTerm">➕ Record First Sale</a>
      </div>
    </div>

    <!-- Delete Modal -->
    <div class="modal-overlay" *ngIf="showDeleteModal" (click)="showDeleteModal = false">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-icon">⚠️</div>
        <h4>Delete Sale Record</h4>
        <p>Are you sure you want to delete this sale record for <strong>{{ saleToDelete?.farmerName }}</strong>?</p>
        <div class="modal-actions">
          <button class="btn btn-modal-cancel" (click)="showDeleteModal = false">Cancel</button>
          <button class="btn btn-modal-delete" (click)="confirmDelete()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .list-container { padding: 1.5rem; max-width: 1200px; margin: 0 auto; }

    .page-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;
    }
    .page-title { font-size: 1.8rem; font-weight: 800; color: #1a472a; margin-bottom: 0.2rem; }
    .page-subtitle { color: #6b7c85; font-size: 0.95rem; margin: 0; }

    .btn-add {
      background: linear-gradient(135deg, #e65100, #f57c00); color: white;
      border: none; border-radius: 12px; padding: 0.6rem 1.5rem;
      font-weight: 600; text-decoration: none; transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(230,81,0,0.3);
    }
    .btn-add:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(230,81,0,0.4); color: white; }

    /* Filters */
    .filter-section { margin-bottom: 1.5rem; }
    .search-box {
      position: relative; display: flex; align-items: center;
      background: #fff; border-radius: 12px; border: 2px solid #e0e0e0;
      padding: 0 1rem; transition: border-color 0.3s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin-bottom: 1rem;
    }
    .search-box:focus-within { border-color: #f57c00; }
    .search-icon { font-size: 1.2rem; margin-right: 0.5rem; }
    .search-input { flex: 1; border: none; outline: none; padding: 0.8rem 0; font-size: 0.95rem; background: transparent; }
    .search-clear { background: none; border: none; cursor: pointer; font-size: 1.1rem; color: #999; }

    /* Summary Bar */
    .summary-bar {
      display: flex; gap: 1.5rem; flex-wrap: wrap;
      background: linear-gradient(135deg, #fff3e0, #ffe0b2);
      padding: 0.8rem 1.5rem; border-radius: 12px;
    }
    .summary-item { display: flex; align-items: center; gap: 0.5rem; }
    .summary-label { font-size: 0.85rem; color: #795548; font-weight: 500; }
    .summary-value { font-size: 1rem; font-weight: 700; color: #e65100; }
    .summary-value.revenue { font-size: 1.1rem; }

    /* Alerts */
    .alert-custom { border-radius: 12px; font-weight: 500; border: none; margin-bottom: 1rem; }
    .alert-success { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .alert-danger { background: #fce4ec !important; color: #c62828 !important; }

    /* Table */
    .table-card {
      background: #fff; border-radius: 16px; overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e8ede9;
    }
    .table-custom { margin: 0; }
    .table-custom thead { background: linear-gradient(to right, #fff8f0, #fff3e0); }
    .table-custom thead th {
      padding: 1rem 1.25rem; font-weight: 700; color: #e65100;
      font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;
      border-bottom: 2px solid #ffe0b2;
    }
    .table-custom tbody td { padding: 0.85rem 1.25rem; vertical-align: middle; border-bottom: 1px solid #f0f0f0; }
    .table-row-animate { transition: all 0.3s; }
    .table-row-animate:hover { background: #fffcf5; }

    .row-number {
      background: #fff3e0; color: #e65100; width: 28px; height: 28px;
      display: inline-flex; align-items: center; justify-content: center;
      border-radius: 8px; font-weight: 700; font-size: 0.8rem;
    }
    .name-cell { display: flex; align-items: center; gap: 0.6rem; }
    .sale-avatar {
      width: 36px; height: 36px; border-radius: 10px;
      background: linear-gradient(135deg, #ffe0b2, #ffcc80); color: #e65100;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.9rem;
    }
    .name-text { font-weight: 600; color: #333; }
    .crop-badge, .qty-text, .date-text { font-size: 0.9rem; color: #555; }
    .price-badge { font-weight: 700; color: #2e7d32; font-size: 0.95rem; }

    /* Actions */
    .action-btns { display: flex; gap: 0.5rem; justify-content: center; }
    .btn-action {
      width: 36px; height: 36px; border-radius: 10px; border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.3s; font-size: 0.9rem;
    }
    .btn-edit { background: #e3f2fd; }
    .btn-edit:hover { background: #bbdefb; transform: scale(1.1); }
    .btn-delete { background: #fce4ec; }
    .btn-delete:hover { background: #f8bbd0; transform: scale(1.1); }

    /* Empty State */
    .empty-state {
      text-align: center; padding: 4rem 2rem; background: #fff;
      border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.06);
    }
    .empty-icon { font-size: 4rem; opacity: 0.3; margin-bottom: 1rem; }
    .empty-state h3 { color: #333; font-weight: 700; }
    .empty-state p { color: #888; }

    /* Modal */
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; z-index: 9999;
    }
    .modal-card {
      background: #fff; border-radius: 20px; padding: 2rem;
      text-align: center; max-width: 400px; width: 90%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .modal-icon { font-size: 3rem; margin-bottom: 0.5rem; }
    .modal-card h4 { font-weight: 700; }
    .modal-card p { color: #666; font-size: 0.9rem; }
    .modal-actions { display: flex; gap: 0.8rem; justify-content: center; margin-top: 1.5rem; }
    .btn-modal-cancel {
      padding: 0.6rem 1.5rem; border-radius: 10px; border: 2px solid #e0e0e0;
      background: #fff; font-weight: 600; cursor: pointer;
    }
    .btn-modal-delete {
      padding: 0.6rem 1.5rem; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #e53935, #c62828); color: white;
      font-weight: 600; cursor: pointer; transition: all 0.3s;
    }
    .btn-modal-delete:hover { transform: translateY(-2px); }

    @media (max-width: 768px) { .list-container { padding: 1rem; } .page-title { font-size: 1.4rem; } }
  `]
})
export class SaleListComponent implements OnInit, OnDestroy {
  private saleService = inject(SaleService);

  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  searchTerm = '';
  isLoading = true;
  successMessage = '';
  errorMessage = '';
  totalFilteredRevenue = 0;
  totalFilteredQty = 0;

  showDeleteModal = false;
  saleToDelete: Sale | null = null;
  private subscription?: Subscription;

  ngOnInit(): void { this.loadSales(); }
  ngOnDestroy(): void { this.subscription?.unsubscribe(); }

  private loadSales(): void {
    this.subscription = this.saleService.getSales().subscribe({
      next: (data) => { this.sales = data; this.filterSales(); this.isLoading = false; },
      error: () => { this.errorMessage = 'Failed to load sales.'; this.isLoading = false; }
    });
  }

  /** Filter sales by search term */
  filterSales(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredSales = [...this.sales];
    } else {
      this.filteredSales = this.sales.filter(s =>
        s.farmerName?.toLowerCase().includes(term) ||
        s.cropName?.toLowerCase().includes(term) ||
        s.date?.includes(term)
      );
    }
    // Update summary totals
    this.totalFilteredRevenue = this.filteredSales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
    this.totalFilteredQty = this.filteredSales.reduce((sum, s) => sum + (s.quantitySold || 0), 0);
  }

  onDelete(sale: Sale): void { this.saleToDelete = sale; this.showDeleteModal = true; }

  async confirmDelete(): Promise<void> {
    if (!this.saleToDelete?.id) return;
    try {
      await this.saleService.deleteSale(this.saleToDelete.id);
      this.successMessage = 'Sale record deleted successfully.';
      this.showDeleteModal = false;
      this.saleToDelete = null;
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error) {
      this.errorMessage = 'Failed to delete sale record.';
      this.showDeleteModal = false;
    }
  }
}
