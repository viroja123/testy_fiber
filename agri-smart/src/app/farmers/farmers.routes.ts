import { Routes } from '@angular/router';
import { FarmerListComponent } from './farmer-list/farmer-list.component';
import { FarmerFormComponent } from './farmer-form/farmer-form.component';

/**
 * Farmer Module Routes
 * Defines routing for farmer CRUD operations.
 */
export const FARMER_ROUTES: Routes = [
  { path: '', component: FarmerListComponent },
  { path: 'add', component: FarmerFormComponent },
  { path: 'edit/:id', component: FarmerFormComponent }
];
