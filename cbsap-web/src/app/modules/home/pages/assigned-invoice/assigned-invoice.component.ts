import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { distinctUntilChanged, filter, Subject, takeUntil } from 'rxjs';
import { TableColumn, ResponseResult } from 'src/app/core/model/common';
import { AssignedInvoice, AssignedInvoiceResult } from 'src/app/core/model/dashboard/assigned-invoice.model';

import { GridService, MenuService } from 'src/app/core/services';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgFor, NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault, CurrencyPipe } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { DateFormatPipe } from '../../../../shared/pipes/dateformat.pipe';
import { Router } from '@angular/router';
import { Menu } from 'primeng/menu';
@Component({
    selector: 'app-assigned-invoice',
    templateUrl: './assigned-invoice.component.html',
    styleUrls: ['./assigned-invoice.component.scss'],
    providers: [DialogService],
    standalone: true,
    imports: [
        TableModule,
        PrimeTemplate,
        NgFor,
        NgClass,
        Tooltip,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        CurrencyPipe ,
        DateFormatPipe,
    ],
})
export class AssignedInvoiceComponent implements OnInit {

  private destroySubject: Subject<void> = new Subject();
  pageSize: number = 10;
  assignedInvoices: AssignedInvoice[] = [];
  columns: TableColumn[] = [];
  loading: boolean = false;
  filterType: string='all';
  overdueCount: number=0;
  allCount: number=0;
  first:number=0;

  constructor(
    private dashboardService: DashboardService,
    private gridService: GridService,
    private router:Router,
    private menuService:MenuService
  ) {}

  ngOnInit(): void {
    this.getAssignedInvoice();
    const srRaw = localStorage.getItem("sr") || "";
    const sr = Number(srRaw.replace(/"/g, ""));
    const prevStoredRole = sr ? Number(sr) : 0;
    this.menuService.currentRole$
      .pipe(
        filter((role) => role !== null),
        distinctUntilChanged(),
        takeUntil(this.destroySubject)
      )
      .subscribe((role) => {
        if (role !== prevStoredRole) {
          setTimeout(() => this.refresh(), 1500);
        }
      });
  }

  refresh() {
    this.first=0;
    this.filterType='all';
    this.getAssignedInvoice();
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.editInvoice($event.data);
  }

  editInvoice(invoice: any) {
    const id = invoice.invoiceId;
    this.router.navigate(['invoices', id, 'edit'], {
      state: { returnUrl: this.router.url },
    });
  }
  
  


  getAssignedInvoice() {
    this.columns = this.gridService.assignedInvoiceColumn();
    this.first=0;
    this.dashboardService
      .getAssignedInvoices(this.filterType)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<AssignedInvoiceResult>) => {
          if (result.isSuccess) {
            this.assignedInvoices = result.responseData!.invoices;
            this.overdueCount = result.responseData!.overdueCount;
            this.allCount = result.responseData!.totalCount;
          }
        },
        error: (error) => this.onError(error),
      });
  }

  onError(error: any) {
    //handle error
  }
}
