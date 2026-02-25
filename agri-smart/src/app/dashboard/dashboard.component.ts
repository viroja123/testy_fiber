import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { FarmerService } from '../services/farmer.service';
import { CropService } from '../services/crop.service';
import { SaleService } from '../services/sale.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { Farmer } from '../models/farmer.model';
import { Crop } from '../models/crop.model';
import { Sale } from '../models/sale.model';

/**
 * DashboardComponent
 * Displays summary statistics, recent records, and a crop production chart.
 * Provides quick overview cards with total counts and recent activity.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent],
  template: `
    <app-spinner *ngIf="isLoading"></app-spinner>

    <div class="dashboard-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">📊 Dashboard</h1>
          <p class="page-subtitle">Welcome to AgriSmart Management System</p>
        </div>
        <div class="header-date">
          <span class="date-badge">📅 {{ currentDate | date:'fullDate' }}</span>
        </div>
      </div>

      <!-- Stats Cards Row -->
      <div class="row g-4 mb-4">
        <!-- Total Farmers Card -->
        <div class="col-xl-3 col-md-6">
          <div class="stat-card stat-farmers" (click)="navigateTo('/farmers')">
            <div class="stat-icon-bg">
              <span class="stat-icon">👨‍🌾</span>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Farmers</span>
              <span class="stat-value">{{ farmers.length }}</span>
            </div>
            <div class="stat-wave"></div>
          </div>
        </div>

        <!-- Total Crops Card -->
        <div class="col-xl-3 col-md-6">
          <div class="stat-card stat-crops" (click)="navigateTo('/crops')">
            <div class="stat-icon-bg">
              <span class="stat-icon">🌱</span>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Crops</span>
              <span class="stat-value">{{ crops.length }}</span>
            </div>
            <div class="stat-wave"></div>
          </div>
        </div>

        <!-- Total Sales Card -->
        <div class="col-xl-3 col-md-6">
          <div class="stat-card stat-sales" (click)="navigateTo('/sales')">
            <div class="stat-icon-bg">
              <span class="stat-icon">💰</span>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Sales</span>
              <span class="stat-value">{{ sales.length }}</span>
            </div>
            <div class="stat-wave"></div>
          </div>
        </div>

        <!-- Revenue Card -->
        <div class="col-xl-3 col-md-6">
          <div class="stat-card stat-revenue">
            <div class="stat-icon-bg">
              <span class="stat-icon">📈</span>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Revenue</span>
              <span class="stat-value">₹{{ totalRevenue | number:'1.0-0' }}</span>
            </div>
            <div class="stat-wave"></div>
          </div>
        </div>
      </div>

      <!-- Charts & Recent Activity Row -->
      <div class="row g-4 mb-4">
        <!-- Crop Production Chart -->
        <div class="col-lg-8">
          <div class="content-card">
            <div class="card-header-custom">
              <h5>🌾 Crop Production Overview</h5>
            </div>
            <div class="card-body-custom">
              <div class="chart-container">
                <canvas #chartCanvas></canvas>
                <!-- Fallback bar chart using CSS -->
                <div class="css-chart" *ngIf="crops.length > 0">
                  <div class="chart-bars">
                    <div class="chart-bar-group" *ngFor="let crop of crops.slice(0, 8); let i = index">
                      <div class="chart-bar"
                           [style.height.%]="getBarHeight(crop.quantity)"
                           [style.background]="barColors[i % barColors.length]"
                           [title]="crop.cropName + ': ' + crop.quantity + ' kg'">
                        <span class="bar-value">{{ crop.quantity }}</span>
                      </div>
                      <span class="bar-label">{{ crop.cropName | slice:0:8 }}</span>
                    </div>
                  </div>
                </div>
                <div class="no-data-chart" *ngIf="crops.length === 0">
                  <span class="no-data-icon">📊</span>
                  <p>No crop data available yet. Add crops to see the chart.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Season Distribution -->
        <div class="col-lg-4">
          <div class="content-card">
            <div class="card-header-custom">
              <h5>🗓️ Season Distribution</h5>
            </div>
            <div class="card-body-custom">
              <div class="season-list">
                <div class="season-item" *ngFor="let season of seasonData">
                  <div class="season-info">
                    <span class="season-badge" [style.background]="season.color">
                      {{ season.icon }}
                    </span>
                    <span class="season-name">{{ season.name }}</span>
                  </div>
                  <div class="season-bar-wrap">
                    <div class="season-bar"
                         [style.width.%]="season.percentage"
                         [style.background]="season.color">
                    </div>
                  </div>
                  <span class="season-count">{{ season.count }} crops</span>
                </div>
              </div>

              <hr class="divider">

              <!-- Quick Stats -->
              <div class="quick-stats">
                <div class="quick-stat">
                  <span class="qs-icon">🏢</span>
                  <div>
                    <span class="qs-value">{{ totalLandArea | number:'1.0-0' }}</span>
                    <span class="qs-label">Total Land (acres)</span>
                  </div>
                </div>
                <div class="quick-stat">
                  <span class="qs-icon">📦</span>
                  <div>
                    <span class="qs-value">{{ totalQuantitySold | number:'1.0-0' }}</span>
                    <span class="qs-label">Qty Sold (kg)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Records Row -->
      <div class="row g-4">
        <!-- Recent Farmers -->
        <div class="col-lg-4">
          <div class="content-card">
            <div class="card-header-custom d-flex justify-content-between align-items-center">
              <h5>👨‍🌾 Recent Farmers</h5>
              <a routerLink="/farmers" class="view-all-link">View All →</a>
            </div>
            <div class="card-body-custom">
              <div class="recent-list" *ngIf="farmers.length > 0">
                <div class="recent-item" *ngFor="let farmer of farmers.slice(0, 5)">
                  <div class="recent-avatar farmer-avatar">{{ farmer.name?.charAt(0)?.toUpperCase() }}</div>
                  <div class="recent-info">
                    <span class="recent-name">{{ farmer.name }}</span>
                    <span class="recent-detail">📱 {{ farmer.phone }} · {{ farmer.landArea }} acres</span>
                  </div>
                </div>
              </div>
              <div class="no-data" *ngIf="farmers.length === 0">
                <p>No farmers added yet.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Crops -->
        <div class="col-lg-4">
          <div class="content-card">
            <div class="card-header-custom d-flex justify-content-between align-items-center">
              <h5>🌱 Recent Crops</h5>
              <a routerLink="/crops" class="view-all-link">View All →</a>
            </div>
            <div class="card-body-custom">
              <div class="recent-list" *ngIf="crops.length > 0">
                <div class="recent-item" *ngFor="let crop of crops.slice(0, 5)">
                  <div class="recent-avatar crop-avatar">{{ crop.cropName?.charAt(0)?.toUpperCase() }}</div>
                  <div class="recent-info">
                    <span class="recent-name">{{ crop.cropName }}</span>
                    <span class="recent-detail">{{ crop.season }} · {{ crop.quantity }} kg · ₹{{ crop.price }}</span>
                  </div>
                </div>
              </div>
              <div class="no-data" *ngIf="crops.length === 0">
                <p>No crops added yet.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Sales -->
        <div class="col-lg-4">
          <div class="content-card">
            <div class="card-header-custom d-flex justify-content-between align-items-center">
              <h5>💰 Recent Sales</h5>
              <a routerLink="/sales" class="view-all-link">View All →</a>
            </div>
            <div class="card-body-custom">
              <div class="recent-list" *ngIf="sales.length > 0">
                <div class="recent-item" *ngFor="let sale of sales.slice(0, 5)">
                  <div class="recent-avatar sale-avatar">₹</div>
                  <div class="recent-info">
                    <span class="recent-name">{{ sale.farmerName }}</span>
                    <span class="recent-detail">{{ sale.cropName }} · {{ sale.quantitySold }} kg · ₹{{ sale.totalPrice }}</span>
                  </div>
                </div>
              </div>
              <div class="no-data" *ngIf="sales.length === 0">
                <p>No sales recorded yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 1.8rem;
      font-weight: 800;
      color: #1a472a;
      margin-bottom: 0.2rem;
    }

    .page-subtitle {
      color: #6b7c85;
      font-size: 0.95rem;
      margin: 0;
    }

    .date-badge {
      background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
      color: #2e7d32;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 500;
      font-size: 0.85rem;
    }

    /* Stat Cards */
    .stat-card {
      padding: 1.5rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .stat-farmers { background: linear-gradient(135deg, #1b5e20, #388e3c); color: white; }
    .stat-crops { background: linear-gradient(135deg, #0d47a1, #1976d2); color: white; }
    .stat-sales { background: linear-gradient(135deg, #e65100, #f57c00); color: white; }
    .stat-revenue { background: linear-gradient(135deg, #4a148c, #7b1fa2); color: white; }

    .stat-icon-bg {
      width: 55px;
      height: 55px;
      background: rgba(255,255,255,0.2);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon { font-size: 1.6rem; }

    .stat-info { display: flex; flex-direction: column; z-index: 1; }
    .stat-label { font-size: 0.8rem; opacity: 0.85; font-weight: 500; }
    .stat-value { font-size: 1.6rem; font-weight: 800; letter-spacing: 0.5px; }

    .stat-wave {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 120px;
      height: 120px;
      background: rgba(255,255,255,0.08);
      border-radius: 50%;
      transform: translate(30%, 30%);
    }

    /* Content Cards */
    .content-card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
      border: 1px solid #e8ede9;
      height: 100%;
      overflow: hidden;
    }

    .card-header-custom {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #eee;
      background: linear-gradient(to right, #f8fdf8, #ffffff);
    }

    .card-header-custom h5 {
      margin: 0;
      font-weight: 700;
      color: #1a472a;
      font-size: 1rem;
    }

    .card-body-custom {
      padding: 1.25rem;
    }

    .view-all-link {
      color: #2e7d32;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      transition: color 0.3s;
    }

    .view-all-link:hover { color: #1b5e20; }

    /* CSS Chart */
    .chart-container { min-height: 280px; }

    .css-chart { padding: 1rem 0; }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 0.8rem;
      height: 220px;
      padding: 0 0.5rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .chart-bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: flex-end;
    }

    .chart-bar {
      width: 100%;
      max-width: 50px;
      border-radius: 8px 8px 0 0;
      min-height: 4px;
      transition: height 0.8s ease;
      position: relative;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }

    .bar-value {
      font-size: 0.65rem;
      color: white;
      font-weight: 700;
      padding-top: 4px;
    }

    .bar-label {
      font-size: 0.7rem;
      color: #666;
      margin-top: 6px;
      text-align: center;
      font-weight: 500;
    }

    .no-data-chart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 250px;
      color: #999;
    }

    .no-data-chart .no-data-icon { font-size: 3rem; opacity: 0.3; }

    /* Season Distribution */
    .season-list { display: flex; flex-direction: column; gap: 0.8rem; }

    .season-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .season-info {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      min-width: 100px;
    }

    .season-badge {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      flex-shrink: 0;
    }

    .season-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: #333;
    }

    .season-bar-wrap {
      flex: 1;
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .season-bar {
      height: 100%;
      border-radius: 4px;
      transition: width 0.8s ease;
    }

    .season-count {
      font-size: 0.75rem;
      color: #888;
      min-width: 55px;
      text-align: right;
    }

    .divider {
      border-color: #eee;
      margin: 1rem 0;
    }

    /* Quick Stats */
    .quick-stats {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .quick-stat {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.6rem;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .qs-icon {
      font-size: 1.4rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e8f5e9;
      border-radius: 10px;
    }

    .qs-value { font-size: 1.1rem; font-weight: 700; color: #1a472a; display: block; }
    .qs-label { font-size: 0.75rem; color: #888; }

    /* Recent Lists */
    .recent-list { display: flex; flex-direction: column; gap: 0.6rem; }

    .recent-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.6rem;
      border-radius: 10px;
      transition: background 0.3s;
    }

    .recent-item:hover { background: #f8fdf8; }

    .recent-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .farmer-avatar { background: linear-gradient(135deg, #c8e6c9, #a5d6a7); color: #1b5e20; }
    .crop-avatar { background: linear-gradient(135deg, #bbdefb, #90caf9); color: #0d47a1; }
    .sale-avatar { background: linear-gradient(135deg, #ffe0b2, #ffcc80); color: #e65100; }

    .recent-info { display: flex; flex-direction: column; overflow: hidden; }
    .recent-name { font-weight: 600; color: #333; font-size: 0.9rem; }
    .recent-detail { font-size: 0.75rem; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .no-data {
      text-align: center;
      padding: 1.5rem;
      color: #999;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-container { padding: 1rem; }
      .page-title { font-size: 1.4rem; }
      .stat-value { font-size: 1.3rem; }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private farmerService = inject(FarmerService);
  private cropService = inject(CropService);
  private saleService = inject(SaleService);

  farmers: Farmer[] = [];
  crops: Crop[] = [];
  sales: Sale[] = [];
  isLoading = true;
  currentDate = new Date();

  /** Calculated metrics */
  totalRevenue = 0;
  totalLandArea = 0;
  totalQuantitySold = 0;

  /** Season distribution data for the sidebar chart */
  seasonData: { name: string; count: number; percentage: number; color: string; icon: string }[] = [];

  /** Bar chart colors */
  barColors = [
    'linear-gradient(180deg, #4caf50, #2e7d32)',
    'linear-gradient(180deg, #2196f3, #0d47a1)',
    'linear-gradient(180deg, #ff9800, #e65100)',
    'linear-gradient(180deg, #9c27b0, #4a148c)',
    'linear-gradient(180deg, #f44336, #b71c1c)',
    'linear-gradient(180deg, #00bcd4, #006064)',
    'linear-gradient(180deg, #ffeb3b, #f57f17)',
    'linear-gradient(180deg, #e91e63, #880e4f)'
  ];

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Load all data from Firestore services
   * Sets up real-time subscriptions for farmers, crops, and sales
   */
  private loadData(): void {
    let loaded = 0;
    const checkLoading = () => {
      loaded++;
      if (loaded >= 3) this.isLoading = false;
    };

    // Subscribe to farmers
    this.subscriptions.push(
      this.farmerService.getFarmers().subscribe(data => {
        this.farmers = data;
        this.totalLandArea = data.reduce((sum, f) => sum + (f.landArea || 0), 0);
        checkLoading();
      })
    );

    // Subscribe to crops
    this.subscriptions.push(
      this.cropService.getCrops().subscribe(data => {
        this.crops = data;
        this.calculateSeasonData(data);
        checkLoading();
      })
    );

    // Subscribe to sales
    this.subscriptions.push(
      this.saleService.getSales().subscribe(data => {
        this.sales = data;
        this.totalRevenue = data.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
        this.totalQuantitySold = data.reduce((sum, s) => sum + (s.quantitySold || 0), 0);
        checkLoading();
      })
    );
  }

  /**
   * Calculate season distribution for the sidebar chart
   */
  private calculateSeasonData(crops: Crop[]): void {
    const seasons = [
      { name: 'Kharif', color: '#4caf50', icon: '☀️' },
      { name: 'Rabi', color: '#2196f3', icon: '❄️' },
      { name: 'Zaid', color: '#ff9800', icon: '🌤️' }
    ];

    const total = crops.length || 1;

    this.seasonData = seasons.map(s => {
      const count = crops.filter(c => c.season === s.name).length;
      return {
        ...s,
        count,
        percentage: (count / total) * 100
      };
    });
  }

  /**
   * Calculate bar height as percentage of max value
   */
  getBarHeight(quantity: number): number {
    const max = Math.max(...this.crops.map(c => c.quantity), 1);
    return (quantity / max) * 90;
  }

  /**
   * Navigate to a specific route
   */
  navigateTo(path: string): void {
    window.location.href = path;
  }
}
