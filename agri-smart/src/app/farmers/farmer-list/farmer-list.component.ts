import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FarmerService } from '../../services/farmer.service';
import { Farmer } from '../../models/farmer.model';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

/**
 * FarmerListComponent
 * Displays a searchable, sortable list of all farmers with CRUD actions.
 */
@Component({
  selector: 'app-farmer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  template: `
    <app-spinner *ngIf="isLoading"></app-spinner>

    <div class="list-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">👨‍🌾 Farmer Management</h1>
          <p class="page-subtitle">Manage all registered farmers</p>
        </div>
        <a routerLink="/farmers/add" class="btn btn-add">
          ➕ Add New Farmer
        </a>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="search-input"
            placeholder="Search farmers by name, phone, or address..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterFarmers()">
          <button class="search-clear" *ngIf="searchTerm" (click)="searchTerm = ''; filterFarmers()">✕</button>
        </div>
        <div class="results-count">
          Showing {{ filteredFarmers.length }} of {{ farmers.length }} farmers
        </div>
      </div>

      <!-- Success/Error Alerts -->
      <div class="alert alert-success alert-custom" *ngIf="successMessage" role="alert">
        ✅ {{ successMessage }}
        <button type="button" class="btn-close" (click)="successMessage = ''"></button>
      </div>
      <div class="alert alert-danger alert-custom" *ngIf="errorMessage" role="alert">
        ❌ {{ errorMessage }}
        <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
      </div>

      <!-- Farmers Table -->
      <div class="table-card" *ngIf="filteredFarmers.length > 0">
        <div class="table-responsive">
          <table class="table table-custom">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Land Area (acres)</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let farmer of filteredFarmers; let i = index" class="table-row-animate">
                <td>
                  <span class="row-number">{{ i + 1 }}</span>
                </td>
                <td>
                  <div class="name-cell">
                    <div class="avatar">{{ farmer.name?.charAt(0)?.toUpperCase() }}</div>
                    <span class="name-text">{{ farmer.name }}</span>
                  </div>
                </td>
                <td><span class="phone-badge">📱 {{ farmer.phone }}</span></td>
                <td><span class="address-text">📍 {{ farmer.address }}</span></td>
                <td><span class="land-badge">🏞️ {{ farmer.landArea }} acres</span></td>
                <td class="text-center">
                  <div class="action-btns">
                    <a [routerLink]="['/farmers/edit', farmer.id]" class="btn btn-action btn-edit" title="Edit">
                      ✏️
                    </a>
                    <button class="btn btn-action btn-delete" title="Delete" (click)="onDelete(farmer)">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data State -->
      <div class="empty-state" *ngIf="filteredFarmers.length === 0 && !isLoading">
        <div class="empty-icon">👨‍🌾</div>
        <h3>No Farmers Found</h3>
        <p *ngIf="searchTerm">No farmers match your search "{{ searchTerm }}"</p>
        <p *ngIf="!searchTerm">Start by adding your first farmer to the system.</p>
        <a routerLink="/farmers/add" class="btn btn-add" *ngIf="!searchTerm">➕ Add First Farmer</a>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" *ngIf="showDeleteModal" (click)="showDeleteModal = false">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-icon">⚠️</div>
        <h4>Delete Farmer</h4>
        <p>Are you sure you want to delete <strong>{{ farmerToDelete?.name }}</strong>?<br>This action cannot be undone.</p>
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
      background: linear-gradient(135deg, #2e7d32, #4caf50); color: white;
      border: none; border-radius: 12px; padding: 0.6rem 1.5rem;
      font-weight: 600; text-decoration: none; transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(46,125,50,0.3);
    }
    .btn-add:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(46,125,50,0.4); color: white; }

    /* Search */
    .search-section { margin-bottom: 1.5rem; }
    .search-box {
      position: relative; display: flex; align-items: center;
      background: #fff; border-radius: 12px; border: 2px solid #e0e0e0;
      padding: 0 1rem; transition: border-color 0.3s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .search-box:focus-within { border-color: #4caf50; }
    .search-icon { font-size: 1.2rem; margin-right: 0.5rem; }
    .search-input {
      flex: 1; border: none; outline: none; padding: 0.8rem 0;
      font-size: 0.95rem; background: transparent;
    }
    .search-clear {
      background: none; border: none; cursor: pointer; font-size: 1.1rem;
      color: #999; padding: 4px 8px; border-radius: 50%;
    }
    .search-clear:hover { background: #f0f0f0; }
    .results-count { font-size: 0.8rem; color: #888; margin-top: 0.5rem; }

    /* Alert */
    .alert-custom { border-radius: 12px; font-weight: 500; border: none; }
    .alert-success { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .alert-danger { background: #fce4ec !important; color: #c62828 !important; }

    /* Table Card */
    .table-card {
      background: #fff; border-radius: 16px; overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e8ede9;
    }

    .table-custom {
      margin: 0; border: none;
    }
    .table-custom thead { background: linear-gradient(to right, #f8fdf8, #f0f7f0); }
    .table-custom thead th {
      padding: 1rem 1.25rem; font-weight: 700; color: #1a472a;
      font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;
      border-bottom: 2px solid #e0e0e0;
    }
    .table-custom tbody td { padding: 0.85rem 1.25rem; vertical-align: middle; border-bottom: 1px solid #f0f0f0; }
    .table-row-animate { transition: all 0.3s; }
    .table-row-animate:hover { background: #f8fdf8; }

    .row-number {
      background: #e8f5e9; color: #2e7d32; width: 28px; height: 28px;
      display: inline-flex; align-items: center; justify-content: center;
      border-radius: 8px; font-weight: 700; font-size: 0.8rem;
    }

    .name-cell { display: flex; align-items: center; gap: 0.6rem; }
    .avatar {
      width: 36px; height: 36px; border-radius: 10px;
      background: linear-gradient(135deg, #c8e6c9, #a5d6a7); color: #1b5e20;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.9rem;
    }
    .name-text { font-weight: 600; color: #333; }

    .phone-badge, .address-text, .land-badge { font-size: 0.9rem; color: #555; }

    /* Action Buttons */
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
      text-align: center; padding: 4rem 2rem;
      background: #fff; border-radius: 16px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
    }
    .empty-icon { font-size: 4rem; opacity: 0.3; margin-bottom: 1rem; }
    .empty-state h3 { color: #333; font-weight: 700; }
    .empty-state p { color: #888; }

    /* Delete Modal */
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
    .modal-card h4 { font-weight: 700; color: #333; }
    .modal-card p { color: #666; font-size: 0.9rem; }
    .modal-actions { display: flex; gap: 0.8rem; justify-content: center; margin-top: 1.5rem; }
    .btn-modal-cancel {
      padding: 0.6rem 1.5rem; border-radius: 10px; border: 2px solid #e0e0e0;
      background: #fff; font-weight: 600; cursor: pointer; transition: all 0.3s;
    }
    .btn-modal-cancel:hover { background: #f5f5f5; }
    .btn-modal-delete {
      padding: 0.6rem 1.5rem; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #e53935, #c62828); color: white;
      font-weight: 600; cursor: pointer; transition: all 0.3s;
    }
    .btn-modal-delete:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(198,40,40,0.4); }

    @media (max-width: 768px) {
      .list-container { padding: 1rem; }
      .page-title { font-size: 1.4rem; }
    }
  `]
})
export class FarmerListComponent implements OnInit, OnDestroy {
  private farmerService = inject(FarmerService);

  farmers: Farmer[] = [];
  filteredFarmers: Farmer[] = [];
  searchTerm = '';
  isLoading = true;
  successMessage = '';
  errorMessage = '';

  /** Delete confirmation modal state */
  showDeleteModal = false;
  farmerToDelete: Farmer | null = null;

  private subscription?: Subscription;

  ngOnInit(): void {
    this.loadFarmers();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /** Subscribe to real-time farmer data */
  private loadFarmers(): void {
    this.subscription = this.farmerService.getFarmers().subscribe({
      next: (data) => {
        this.farmers = data;
        this.filterFarmers();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load farmers. Please try again.';
        this.isLoading = false;
        console.error('Error loading farmers:', err);
      }
    });
  }

  /** Filter farmers by search term */
  filterFarmers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredFarmers = [...this.farmers];
    } else {
      this.filteredFarmers = this.farmers.filter(f =>
        f.name?.toLowerCase().includes(term) ||
        f.phone?.toLowerCase().includes(term) ||
        f.address?.toLowerCase().includes(term)
      );
    }
  }

  /** Open delete confirmation modal */
  onDelete(farmer: Farmer): void {
    this.farmerToDelete = farmer;
    this.showDeleteModal = true;
  }

  /** Confirm and execute deletion */
  async confirmDelete(): Promise<void> {
    if (!this.farmerToDelete?.id) return;

    try {
      await this.farmerService.deleteFarmer(this.farmerToDelete.id);
      this.successMessage = `Farmer "${this.farmerToDelete.name}" deleted successfully.`;
      this.showDeleteModal = false;
      this.farmerToDelete = null;

      // Auto-hide success message after 3 seconds
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error) {
      this.errorMessage = 'Failed to delete farmer. Please try again.';
      this.showDeleteModal = false;
      console.error('Delete error:', error);
    }
  }
}
