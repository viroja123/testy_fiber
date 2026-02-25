import { Routes } from '@angular/router';
import { CropListComponent } from './crop-list/crop-list.component';
import { CropFormComponent } from './crop-form/crop-form.component';

/**
 * Crop Module Routes
 */
export const CROP_ROUTES: Routes = [
  { path: '', component: CropListComponent },
  { path: 'add', component: CropFormComponent },
  { path: 'edit/:id', component: CropFormComponent }
];
