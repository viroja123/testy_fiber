import { Routes } from '@angular/router';
import { SaleListComponent } from './sale-list/sale-list.component';
import { SaleFormComponent } from './sale-form/sale-form.component';

/**
 * Sales Module Routes
 */
export const SALE_ROUTES: Routes = [
  { path: '', component: SaleListComponent },
  { path: 'add', component: SaleFormComponent },
  { path: 'edit/:id', component: SaleFormComponent }
];
