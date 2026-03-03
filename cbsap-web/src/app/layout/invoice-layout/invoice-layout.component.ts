import { Component } from '@angular/core';
import { InvoiceMainComponent } from '@modules/invoice/pages/invoice-detail/invoice-main/invoice-main.component';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { TopbarComponent } from '@layout/topbar/topbar.component';
import { LoaderComponent } from '@shared/loader/loader.component';

@Component({
  selector: 'app-invoice-layout',
  standalone: true,
  imports: [
    TopbarComponent,
    InvoiceMainComponent,
    PrimeImportsModule,
    LoaderComponent,
  ],
  templateUrl: './invoice-layout.component.html',
  styleUrl: './invoice-layout.component.scss',
})
export class InvoiceLayoutComponent {}
