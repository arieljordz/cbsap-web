import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageSeverity } from '@core/constants';
import { getInvoiceStatusFilterOptions } from '@core/constants/common/invoice-status-filter.options';
import { TableColumn } from '@core/model/common/grid-column';
import { SearchField, CustomButton } from '@core/model/quick-search/QuickSearchModel';
import { Pagination, ResponseResult } from '@core/model/common';
import {
  InvoiceInquirySearchDto,
  InvoiceInquirySearchFilters
} from '@core/model/reports/invoice-inquiry/invoice-inquiry-searchDto';
import {
  ExportInvoiceInquiryQuery,
  SearchInvoiceInquiryQuery
} from '@core/model/reports/invoice-inquiry/invoice-inquiry.index';
import {
  AlertService,
  InvoiceInquiryService,
  ExcelService,
  GridService,
} from '@core/services';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'invoice-inquiry-search',
  standalone: true,
  providers: [AlertService, DatePipe, ConfirmationService, InvoiceInquiryService],
  imports: [CommonModule, FormsModule, PrimeImportsModule, NgClass, NgFor, NgIf, QuickSearchComponent],
  templateUrl: './invoice-inquiry-search.component.html',
  styleUrl: './invoice-inquiry-search.component.scss',
})
export class InvoiceInquirySearchComponent implements OnInit, OnDestroy {

  @ViewChild('dtSearchInvoiceInquiryPagination') table: Table | undefined;

  private destroySubject: Subject<void> = new Subject();

  private getDefaultFilters(): InvoiceInquirySearchFilters {
    return {
      SupplierName: '',
      InvoiceNumber: '',
      PONumber: '',
      Status: null,
      ScanDateFrom: null,
      ScanDateTo: null,
      InvoiceDateFrom: null,
      InvoiceDateTo: null,
    };
  }

  invoiceInquirySearchFilters: InvoiceInquirySearchFilters = this.getDefaultFilters();

  invoiceInquirypagination: InvoiceInquirySearchDto[] = [];
  columns: TableColumn[] = [];
  sizes: any;

  totalRecords = 0;
  pageNumber = 1;
  pageSize = 10;
  loading = false;
  sortField?: string;
  sortOrder = 1;

  searchActionButtonsConfig: {
    search?: boolean;
    clear?: boolean;
    export?: boolean;
    custom?: CustomButton[];
  } = {
    search: true,
    clear: true,
    export: true,
    custom: [
      {
        label: 'Adv Search',
        icon: 'pi pi-search',
        severity: 'secondary',
        action: () => this.onAdvancedSearch(),
      },
    ],
  };

  invoiceInquiryFields: SearchField<InvoiceInquirySearchFilters>[] = [
    { key: 'SupplierName', label: 'Supplier Name', type: 'text', fieldType: 'input' },
    { key: 'InvoiceNumber', label: 'Invoice Number', type: 'text', fieldType: 'input' },
    { key: 'PONumber', label: 'PO Number', type: 'text', fieldType: 'input' },
    { key: 'ScanDateFrom', label: 'Scan Date From', type: 'date', fieldType: 'input' },
    { key: 'ScanDateTo', label: 'Scan Date To', type: 'date', fieldType: 'input' },
    { key: 'InvoiceDateFrom', label: 'Invoice Date From', type: 'date', fieldType: 'input' },
    { key: 'InvoiceDateTo', label: 'Invoice Date To', type: 'date', fieldType: 'input' },
    {
      key: 'Status',
      label: 'Status',
      type: 'number',
      fieldType: 'dropdown',
      options: getInvoiceStatusFilterOptions(),
    },
  ];

  constructor(
    private router: Router,
    private gridService: GridService,
    private invoiceInquiryService: InvoiceInquiryService,
    private message: AlertService,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.clear();
    this.loadStoredFilters();
    this.initializeGrid();
    this.searchInvoiceInquiry();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  private loadStoredFilters(): void {
    const stored = localStorage.getItem('invoice-inquiry-search');
    if (stored) {
      this.invoiceInquirySearchFilters = JSON.parse(stored);
    }
  }

  private initializeGrid(): void {
    this.columns = this.gridService.invoiceInquiryGridColumn();
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
  }

  onAdvancedSearch() {}

  search(filters: InvoiceInquirySearchFilters): void {
    this.invoiceInquirySearchFilters = filters;
    this.pageNumber = 1;
    this.persistFilters();
    this.searchInvoiceInquiry();
  }

  clear(): void {
    localStorage.removeItem('invoice-inquiry-search');
    localStorage.removeItem('invoice-inquiry-grid');

    this.invoiceInquirySearchFilters = this.getDefaultFilters();

    this.pageNumber = 1;
    this.pageSize = 10;
    this.sortField = undefined;
    this.sortOrder = 1;

    this.table?.reset();
    this.searchInvoiceInquiry();
  }

  private persistFilters(): void {
    localStorage.setItem('invoice-inquiry-search', JSON.stringify(this.invoiceInquirySearchFilters));
  }

  private buildSearchQuery(): SearchInvoiceInquiryQuery {
    const filters: any = { ...this.invoiceInquirySearchFilters };

    this.normalizeDates(filters);

    Object.keys(filters).forEach(key => {
      if (filters[key] == null || filters[key] === '') {
        delete filters[key];
      }
    });

    return {
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      SortField: this.sortField,
      SortOrder: this.sortOrder,

      invoiceInquirySearchDto: filters || {}
    };
  }

  private normalizeDates(filters: any): void {
    const dateFields = [
      'ScanDateFrom',
      'ScanDateTo',
      'InvoiceDateFrom',
      'InvoiceDateTo'
    ];

    dateFields.forEach(field => {
      if (filters[field] instanceof Date) {
        filters[field] = this.datePipe.transform(filters[field], 'yyyy-MM-dd');
      }
    });
  }

  searchInvoiceInquiry(): void {
    this.loading = true;

    const query = this.buildSearchQuery();
    
    this.invoiceInquiryService
      .searchInvoiceInquiry(query)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result) => {
          if (result.isSuccess && result.responseData) {
            this.invoiceInquirypagination = result.responseData.data ?? [];
            this.totalRecords = result.responseData.totalCount ?? 0;
          }
          this.loading = false;
        },
        error: (error) => this.onError(error),
      });
  }

  exportToExcel() {
    if (this.totalRecords === 0) {
      this.message.showToast(
        MessageSeverity.warn,
        'Warning ',
        'Please hit search button before exporting data'
      );
      return;
    }

    this.loading = true;

    let exportInvoiceInquiryQuery: ExportInvoiceInquiryQuery = {
      SupplierName: this.invoiceInquirySearchFilters.SupplierName,
      InvoiceNumber: this.invoiceInquirySearchFilters.InvoiceNumber,
      PONumber: this.invoiceInquirySearchFilters.PONumber,
      Status: this.invoiceInquirySearchFilters.Status,
      ScanDateFrom: this.invoiceInquirySearchFilters.ScanDateFrom,
      ScanDateTo: this.invoiceInquirySearchFilters.ScanDateTo,
      InvoiceDateFrom: this.invoiceInquirySearchFilters.InvoiceDateFrom,
      InvoiceDateTo: this.invoiceInquirySearchFilters.InvoiceDateTo
    };

    if (!this.invoiceInquirySearchFilters.SupplierName) {
      delete exportInvoiceInquiryQuery.SupplierName;
    }
    if (!this.invoiceInquirySearchFilters.InvoiceNumber) {
      delete exportInvoiceInquiryQuery.InvoiceNumber;
    }
    if (!this.invoiceInquirySearchFilters.PONumber) {
      delete exportInvoiceInquiryQuery.PONumber;
    }
    if (!this.invoiceInquirySearchFilters.Status) {
      delete exportInvoiceInquiryQuery.Status;
    }
    this.invoiceInquiryService
      .exportInvoiceInquiry(exportInvoiceInquiryQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Blob>) => {
          if (result.isSuccess) {
            if (result.responseData) {
              const blob = result.responseData;
              this.excelService.saveFile(blob, this.getTimestampedFileName());
            } else {
            }
            this.loading = false;
          }
        },
        error: (error) => this.onError(error),
      });
  }
  
  onLazyLoad(event: any): void {
    this.sortField = event.sortField || undefined;
    this.sortOrder = event.sortOrder || 1;
    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;

    this.searchInvoiceInquiry();
  }

  getTimestampedFileName(): string {
    const timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    return `InvoiceInquiry_${timestamp}.xlsx`;
  }

  onError(error: any): void {
    this.loading = false;
    console.error(error);
  }
}