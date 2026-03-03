import { Component } from '@angular/core';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-invoice-topbar',
  standalone: true,
  imports: [PrimeImportsModule],
  templateUrl: './invoice-topbar.component.html',
  styleUrl: './invoice-topbar.component.scss',
})
export class InvoiceTopbarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard Alert',
      icon: 'pi pi-bell',
      command: () => console.log('Dashboard Alert clicked'),
      template: () => `
      <div class="flex items-center space-x-2">
        <span>Dashboard Alert</span>
        <span class="relative inline-block">
          <i class="pi pi-bell text-base"></i>
          <span class="p-badge p-badge-danger p-badge-sm absolute -top-1 -right-2">2</span>
        </span>
      </div>
    `,
    },
    { label: 'Exception Queue', command: () => console.log('Exception Queue') },
    { label: 'Reject Queue', command: () => console.log('Reject Queue') },
    { label: 'Archive Invoice', command: () => console.log('Archive Invoice') },
    { label: 'System Setting', command: () => console.log('System Setting') },
    { label: 'Back', command: () => console.log('Back clicked') },
  ];
}
