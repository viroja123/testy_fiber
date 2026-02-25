import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CropService } from '../../services/crop.service';
import { Crop } from '../../models/crop.model';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

/**
 * CropListComponent
 * Displays a filterable list of all crops with season filtering and CRUD actions.
 */
@Component({
  selector: 'app-crop-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  template: `
    <app-spinner *ngIf="isLoading"></app-spinner>

    <div class="list-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">🌱 Crop Management</h1>
          <p class="page-subtitle">Manage all crop records</p>
        </div>
        <a routerLink="/crops/add" class="btn btn-add">
          ➕ Add New Crop
        </a>
      </div>

      <!-- Filters Row -->
      <div class="filter-section">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="search-input"
            placeholder="Search crops by name or type..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterCrops()">
          <button class="search-clear" *ngIf="searchTerm" (click)="searchTerm = ''; filterCrops()">✕</button>
        </div>

        <div class="season-filters">
          <button
            class="season-chip"
            [class.active]="selectedSeason === ''"
            (click)="selectedSeason = ''; filterCrops()">
            All Seasons
          </button>
          <button
            *ngFor="let season of seasons"
            class="season-chip"
            [class.active]="selectedSeason === season.name"
            (click)="selectedSeason = season.name; filterCrops()">
            {{ season.icon }} {{ season.name }}
          </button>
        </div>

        <div class="results-count">
          Showing {{ filteredCrops.length }} of {{ crops.length }} crops
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

      <!-- Crops Grid -->
      <div class="crops-grid" *ngIf="filteredCrops.length > 0">
        <div class="crop-card" *ngFor="let crop of filteredCrops; let i = index">
          <div class="crop-card-header" [style.background]="getSeasonGradient(crop.season)">
            <span class="crop-season-tag">{{ getSeasonIcon(crop.season) }} {{ crop.season }}</span>
            <div class="crop-actions">
              <a [routerLink]="['/crops/edit', crop.id]" class="action-btn edit-btn" title="Edit">✏️</a>
              <button class="action-btn delete-btn" title="Delete" (click)="onDelete(crop)">🗑️</button>
            </div>
          </div>
          <div class="crop-card-body">
            <h4 class="crop-name">{{ crop.cropName }}</h4>
            <span class="crop-type-badge">{{ crop.type }}</span>
            <div class="crop-details">
              <div class="detail-row">
                <span class="detail-label">📦 Quantity</span>
                <span class="detail-value">{{ crop.quantity }} kg</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">💰 Price</span>
                <span class="detail-value">₹{{ crop.price }}/kg</span>
              </div>
              <div class="detail-row total-row">
                <span class="detail-label">📊 Total Value</span>
                <span class="detail-value highlight">₹{{ crop.quantity * crop.price | number:'1.0-0' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="filteredCrops.length === 0 && !isLoading">
        <div class="empty-icon">🌱</div>
        <h3>No Crops Found</h3>
        <p *ngIf="searchTerm || selectedSeason">No crops match your filters.</p>
        <p *ngIf="!searchTerm && !selectedSeason">Start by adding your first crop.</p>
        <a routerLink="/crops/add" class="btn btn-add" *ngIf="!searchTerm && !selectedSeason">➕ Add First Crop</a>
      </div>
    </div>

    <!-- Delete Modal -->
    <div class="modal-overlay" *ngIf="showDeleteModal" (click)="showDeleteModal = false">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-icon">⚠️</div>
        <h4>Delete Crop</h4>
        <p>Are you sure you want to delete <strong>{{ cropToDelete?.cropName }}</strong>?</p>
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

    /* Filters */
    .filter-section { margin-bottom: 1.5rem; }
    .search-box {
      position: relative; display: flex; align-items: center;
      background: #fff; border-radius: 12px; border: 2px solid #e0e0e0;
      padding: 0 1rem; transition: border-color 0.3s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin-bottom: 1rem;
    }
    .search-box:focus-within { border-color: #4caf50; }
    .search-icon { font-size: 1.2rem; margin-right: 0.5rem; }
    .search-input { flex: 1; border: none; outline: none; padding: 0.8rem 0; font-size: 0.95rem; background: transparent; }
    .search-clear { background: none; border: none; cursor: pointer; font-size: 1.1rem; color: #999; padding: 4px 8px; border-radius: 50%; }

    .season-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
    .season-chip {
      padding: 0.4rem 1rem; border-radius: 20px; border: 2px solid #e0e0e0;
      background: #fff; cursor: pointer; font-size: 0.85rem; font-weight: 500;
      transition: all 0.3s; color: #555;
    }
    .season-chip:hover { border-color: #4caf50; color: #2e7d32; }
    .season-chip.active {
      background: linear-gradient(135deg, #2e7d32, #4caf50); color: white;
      border-color: transparent; box-shadow: 0 2px 8px rgba(46,125,50,0.3);
    }

    .results-count { font-size: 0.8rem; color: #888; }

    /* Alerts */
    .alert-custom { border-radius: 12px; font-weight: 500; border: none; margin-bottom: 1rem; }
    .alert-success { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .alert-danger { background: #fce4ec !important; color: #c62828 !important; }

    /* Crop Cards Grid */
    .crops-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .crop-card {
      background: #fff; border-radius: 16px; overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e8ede9;
      transition: all 0.3s;
    }
    .crop-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }

    .crop-card-header {
      padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center;
    }
    .crop-season-tag {
      color: white; font-weight: 600; font-size: 0.8rem;
      background: rgba(255,255,255,0.2); padding: 0.3rem 0.8rem; border-radius: 20px;
    }
    .crop-actions { display: flex; gap: 0.3rem; }
    .action-btn {
      width: 32px; height: 32px; border-radius: 8px; border: none;
      background: rgba(255,255,255,0.25); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; transition: all 0.3s; text-decoration: none;
    }
    .action-btn:hover { background: rgba(255,255,255,0.4); transform: scale(1.1); }

    .crop-card-body { padding: 1.25rem; }
    .crop-name { font-weight: 700; color: #1a472a; margin-bottom: 0.3rem; font-size: 1.15rem; }
    .crop-type-badge {
      display: inline-block; background: #e8f5e9; color: #2e7d32;
      padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
      margin-bottom: 1rem;
    }
    .crop-details { display: flex; flex-direction: column; gap: 0.5rem; }
    .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 0; }
    .detail-label { color: #888; font-size: 0.85rem; }
    .detail-value { font-weight: 600; color: #333; font-size: 0.9rem; }
    .total-row { border-top: 1px dashed #e0e0e0; padding-top: 0.6rem; margin-top: 0.3rem; }
    .detail-value.highlight { color: #2e7d32; font-size: 1rem; }

    /* Empty State */
    .empty-state {
      text-align: center; padding: 4rem 2rem; background: #fff;
      border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.06);
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
      background: #fff; font-weight: 600; cursor: pointer;
    }
    .btn-modal-delete {
      padding: 0.6rem 1.5rem; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #e53935, #c62828); color: white;
      font-weight: 600; cursor: pointer; transition: all 0.3s;
    }
    .btn-modal-delete:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(198,40,40,0.4); }

    @media (max-width: 768px) {
      .list-container { padding: 1rem; }
      .page-title { font-size: 1.4rem; }
      .crops-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CropListComponent implements OnInit, OnDestroy {
  private cropService = inject(CropService);

  crops: Crop[] = [];
  filteredCrops: Crop[] = [];
  searchTerm = '';
  selectedSeason = '';
  isLoading = true;
  successMessage = '';
  errorMessage = '';

  /** Season filter options */
  seasons = [
    { name: 'Kharif', icon: '☀️' },
    { name: 'Rabi', icon: '❄️' },
    { name: 'Zaid', icon: '🌤️' }
  ];

  showDeleteModal = false;
  cropToDelete: Crop | null = null;

  private subscription?: Subscription;

  ngOnInit(): void { this.loadCrops(); }
  ngOnDestroy(): void { this.subscription?.unsubscribe(); }

  private loadCrops(): void {
    this.subscription = this.cropService.getCrops().subscribe({
      next: (data) => { this.crops = data; this.filterCrops(); this.isLoading = false; },
      error: (err) => { this.errorMessage = 'Failed to load crops.'; this.isLoading = false; }
    });
  }

  /** Filter crops by search term and selected season */
  filterCrops(): void {
    let result = [...this.crops];
    const term = this.searchTerm.toLowerCase().trim();

    if (term) {
      result = result.filter(c =>
        c.cropName?.toLowerCase().includes(term) ||
        c.type?.toLowerCase().includes(term)
      );
    }

    if (this.selectedSeason) {
      result = result.filter(c => c.season === this.selectedSeason);
    }

    this.filteredCrops = result;
  }

  /** Get gradient color based on season */
  getSeasonGradient(season: string): string {
    switch (season) {
      case 'Kharif': return 'linear-gradient(135deg, #1b5e20, #388e3c)';
      case 'Rabi': return 'linear-gradient(135deg, #0d47a1, #1976d2)';
      case 'Zaid': return 'linear-gradient(135deg, #e65100, #f57c00)';
      default: return 'linear-gradient(135deg, #424242, #616161)';
    }
  }

  /** Get emoji icon for season */
  getSeasonIcon(season: string): string {
    switch (season) {
      case 'Kharif': return '☀️';
      case 'Rabi': return '❄️';
      case 'Zaid': return '🌤️';
      default: return '🌿';
    }
  }

  onDelete(crop: Crop): void { this.cropToDelete = crop; this.showDeleteModal = true; }

  async confirmDelete(): Promise<void> {
    if (!this.cropToDelete?.id) return;
    try {
      await this.cropService.deleteCrop(this.cropToDelete.id);
      this.successMessage = `Crop "${this.cropToDelete.cropName}" deleted.`;
      this.showDeleteModal = false;
      this.cropToDelete = null;
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error) {
      this.errorMessage = 'Failed to delete crop.';
      this.showDeleteModal = false;
    }
  }
}
