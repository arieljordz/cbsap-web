import { Routes } from '@angular/router';
import { PermissionSearchComponent } from './pages/permission-search/permission-search.component';
import { PermissionDetailComponent } from './pages/permission-detail/permission-detail.component';

export const PERMISSION_ROUTES: Routes = [
  {
    path: '',
    component: PermissionSearchComponent, // Directly set component
  },
  {
    path: 'edit-permission/:id',
    component: PermissionDetailComponent,
  },
  {
    path: 'new-permission',
    component: PermissionDetailComponent,
  },
];
