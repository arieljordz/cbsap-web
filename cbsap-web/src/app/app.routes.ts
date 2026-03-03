import { ARCHIVE_INVOICE_ROUTES } from './modules/settings/archive-invoice/archive-invoice.routes';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '@layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from '@layout/content-layout/content-layout.component';
import { ErrorpageComponent } from '@modules/errorpage/errorpage.component';

export const appRoutes: Routes = [
  {
    path: 'error',
    component: ErrorpageComponent,
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('@modules/auth/auth.routes').then((r) => r.AUTH_ROUTES),
  },
  {
    path: '',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import('@modules/home/home.routes').then((r) => r.HOME_ROUTES),
  },
  {
    path: 'user-management',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import('@modules/user-management/user-management.routes').then(
        (r) => r.USER_ROUTES
      ),
  },
  {
    path: 'permission-management',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import(
        '@modules/permission-management/permission-management.routes'
      ).then((r) => r.PERMISSION_ROUTES),
  },
  {
    path: 'role-management',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import('@modules/role-management/role-management.routes').then(
        (r) => r.ROLE_MGMT_ROUTES
      ),
  },
  {
    path: 'taxcode-management',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import('@modules/taxcode-management/taxcode-management.routes').then(
        (r) => r.TAXCODE_ROUTES
      ),
  },
  {
    path: 'keyword-management',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import('@modules/keyword-management/keyword.routes').then(
        (r) => r.KEYWORD_ROUTES
      ),
  },
  {
    path: 'entity-profile-management',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import('@modules/settings/entity-profile/entity-profile.routes').then(
        (r) => r.ENTITY_PROFILE_ROUTES
      ),
  },
  {
    path: 'archive-invoice',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import('@modules/settings/archive-invoice/archive-invoice.routes').then(
        (r) => r.ARCHIVE_INVOICE_ROUTES
      ),
  },
  {
    path: 'supplier-management',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import(
        '@modules/settings/supplier-management/supplier-management.routes'
      ).then((r) => r.SUPPLIER_ROUTES),
  },
  {
    path: 'inv-routing-flow-management',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import(
        '@modules/settings/invoice-routing-flows/invoice-routing-flows.routes'
      ).then((r) => r.INVOICE_ROUTING_ROUTES),
  },
  {
    path: 'my-invoices',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import('@modules/invoice/invoice.search.routes').then(
        (r) => r.INVOICE_SEARCH_ROUTES
      ),
  },
  {
    path: 'rejected-queue',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import('@modules/invoice/invoice.search.routes').then(
        (r) => r.REJECTED_INVOICE_ROUTES
      ),
  },
  {
    path: 'exception-queue',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import('@modules/invoice/invoice.search.routes').then(
        (r) => r.EXCEPTION_INVOICE_ROUTES
      ),
  },
  {
    path: 'archive-queue',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import('@modules/invoice/invoice.search.routes').then(
        (r) => r.ARCHIVE_INVOICE_ROUTES
      ),
  },
  {
    path: 'invoices',
    loadChildren: () =>
      import('@modules/invoice/invoice.routes').then((m) => m.INVOICE_ROUTES),
  },
  {
    path: 'reference-data-lookup',
    component: ContentLayoutComponent,
    loadChildren: () =>
      import('@modules/reference-data-lookup/reference-data-lookup.routes').then(
        (r) => r.REFERENCE_DATA_LOOKUP_ROUTES
      ),
  },
  {
    path: '**',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
];
