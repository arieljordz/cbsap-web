import { Routes } from '@angular/router';

// // invoice.routes.ts
export const INVOICE_ROUTES: Routes = [
  {
    path: ':id/edit',
    loadComponent: () =>
      import('@layout/invoice-layout/invoice-layout.component').then(
        (m) => m.InvoiceLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/invoice-detail/invoice-main/invoice-main.component').then((m) => m.InvoiceMainComponent),
      },
    ],
  },
];
