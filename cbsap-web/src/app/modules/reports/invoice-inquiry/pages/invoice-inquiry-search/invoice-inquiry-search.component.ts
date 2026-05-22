import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { MessageSeverity } from '@core/constants';

import { getInvoiceStatusFilterOptions } from '@core/constants/common/invoice-status-filter.options';

import { TableColumn } from '@core/model/common/grid-column';

import {

 SearchField,

 CustomButton,

  } from '@core/model/quick-search/QuickSearchModel';

import { Pagination, ResponseResult } from '@core/model/common';

import {

 InvoiceInquirySearchDto,

 InvoiceInquirySearchFilters,

} from '@core/model/reports/invoice-inquiry/invoice-inquiry-searchDto';

import {

 ExportInvoiceInquiryQuery,

 SearchInvoiceInquiryQuery,

} from '@core/model/reports/invoice-inquiry/invoice-inquiry.index';

  import {

    AlertService,

    InvoiceInquiryService,

    ExcelService,

    GridService,

    LookupOptionsService,

} from '@core/services';

     import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';

    import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';

   import { ConfirmationService, SelectItem } from 'primeng/api';

   import { Table } from 'primeng/table';

   import { Subject, takeUntil } from 'rxjs';



   type DateFieldKeys =

    | 'InvoiceDateFrom' | 'InvoiceDateTo'

    | 'InvoiceDueDateFrom' | 'InvoiceDueDateTo'

    | 'PaymentDateFrom' | 'PaymentDateTo'

    | 'ScanDateFrom' | 'ScanDateTo';



       @Component({

       selector: 'invoice-inquiry-search',

      standalone: true,

      providers: [AlertService, DatePipe, ConfirmationService, InvoiceInquiryService, LookupOptionsService],

      imports: [CommonModule, FormsModule, PrimeImportsModule, NgClass, NgFor, NgIf, QuickSearchComponent],

      templateUrl: './invoice-inquiry-search.component.html',

       styleUrl: './invoice-inquiry-search.component.scss',

      })



     export class InvoiceInquirySearchComponent implements OnInit, OnDestroy {

      @ViewChild('dtSearchInvoiceInquiryPagination') table: Table | undefined;



      private destroySubject: Subject<void> = new Subject();



     private getDefaultFilters(): InvoiceInquirySearchFilters {

      return {

          SupplierInfoID: null,

         InvoiceNumber: '',

          PONumber: '',

           RoleID: null,


            Status: null,

         InvoiceDateFrom: null,

       InvoiceDateTo: null,

       InvoiceDueDateFrom: null,

       InvoiceDueDateTo: null,

       PaymentDateFrom: null,

      PaymentDateTo: null,

     ScanDateFrom: null,

     ScanDateTo: null,

  };

 }



     invoiceInquirySearchFilters: InvoiceInquirySearchFilters =
       this.getDefaultFilters();



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



   invoiceInquiryFields: SearchField<InvoiceInquirySearchFilters>[] = [];

     supplierOptions: SelectItem[] = [];
     roleOptions: SelectItem[] = [];



      constructor(

     private router: Router,

      private gridService: GridService,

     private invoiceInquiryService: InvoiceInquiryService,

       private message: AlertService,

       private excelService: ExcelService,

          private datePipe: DatePipe,

            private lookUpOptionService: LookupOptionsService,

             ) {}



             ngOnInit(): void {

         this.lookUpOptionService.supplierLookUpOptions$

        .pipe(takeUntil(this.destroySubject))

        .subscribe((suppliers) => {

        this.supplierOptions = suppliers;

       this.invoiceInquiryFields = this.buildInvoiceInquiryFields();

        });

        this.lookUpOptionService.rolesLookUpOptions$
        .pipe(takeUntil(this.destroySubject))
        .subscribe((roles) => {
          this.roleOptions = roles;
          this.invoiceInquiryFields = this.buildInvoiceInquiryFields();


        });
        
        



      this.initializeGrid();

      this.loadStoredFilters();

       this.clear();

        this.searchInvoiceInquiry();

    }



 private buildInvoiceInquiryFields(): SearchField<InvoiceInquirySearchFilters>[] {

 return [

   { key: 'SupplierInfoID', label: 'Supplier Name', type: 'number', fieldType: 'dropdown', options: this.supplierOptions, filter: true, colSpan: 2, row: 1 },
   { key: 'InvoiceNumber', label: 'Invoice Number', type: 'text', fieldType: 'input', colSpan: 2, row: 1 },
   { key: 'PONumber', label: 'PO Number', type: 'text', fieldType: 'input', colSpan: 2, row: 1 },
   { key: 'RoleID', label: 'Role', type: 'number', fieldType: 'dropdown', options: this.roleOptions, filter: true, colSpan: 2, row: 1 },
   { key: 'Status', label: 'Status', type: 'number', fieldType: 'multiselect', options: getInvoiceStatusFilterOptions(), filter: false, colSpan: 2, row: 1 },
   { key: 'InvoiceDateFrom', label: 'Invoice Date', type: 'date', fieldType: 'range', colSpan: 2,row: 2 },
   { key: 'InvoiceDateTo', label: '\u00A0', type: 'date', fieldType: 'range', colSpan: 2, row: 2 },

   { key: 'InvoiceDueDateFrom', label: 'Invoice Due Date', type: 'date', fieldType: 'range', colSpan: 2, row: 2 },

    { key: 'InvoiceDueDateTo', label: '\u00A0', type: 'date', fieldType: 'range', colSpan: 2, row: 2 },

    { key: 'PaymentDateFrom', label: 'Payment Date', type: 'date', fieldType: 'range', colSpan: 2, row: 2 },

    { key: 'PaymentDateTo', label: '\u00A0', type: 'date', fieldType: 'range', colSpan: 2, row: 2 },

    { key: 'ScanDateFrom', label: 'Scan Date', type: 'date', fieldType: 'range', colSpan: 2, row: 2 },

     { key: 'ScanDateTo', label: '\u00A0', type: 'date', fieldType: 'range', colSpan: 2, row: 2 },

 ];

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

     localStorage.setItem(

    'invoice-inquiry-search',

     JSON.stringify(this.invoiceInquirySearchFilters),

     );

     }



     private formatDate(value: Date | string | null | undefined): string | null {

      if (!value) return null;

      return this.datePipe.transform(new Date(value), 'yyyy-MM-dd');

       }



      private mapDateFields(

    filters: InvoiceInquirySearchFilters,

     target: Partial<InvoiceInquirySearchFilters>

       ) {

     const dateFields = [

      'InvoiceDate',

      'InvoiceDueDate',

       'PaymentDate',

      'ScanDate',

      ] as const;



  dateFields.forEach((field) => {

  const fromKey = `${field}From` as DateFieldKeys;

  const toKey = `${field}To` as DateFieldKeys;



 target[fromKey] = this.formatDate(filters[fromKey]);

  target[toKey] = this.formatDate(filters[toKey]);

    });

    }



    private removeEmpty(obj: any) {

     return Object.fromEntries(

    Object.entries(obj).filter(

      ([_, value]) =>

       value !== null &&
     value !== undefined &&

   value !== '' &&

    !(Array.isArray(value) && value.length === 0)

      )

       );

        }



        private buildSearchQuery(): SearchInvoiceInquiryQuery {

         const base: any = {

        SupplierInfoID: this.invoiceInquirySearchFilters.SupplierInfoID,

        InvoiceNumber: this.invoiceInquirySearchFilters.InvoiceNumber,

      PONumber: this.invoiceInquirySearchFilters.PONumber,

       RoleID: this.invoiceInquirySearchFilters.RoleID,

      Status: this.invoiceInquirySearchFilters.Status,

    };



 this.mapDateFields(this.invoiceInquirySearchFilters, base);



  const cleaned = this.sanitizeFilters(base);



   const finalFilters = this.removeEmpty(cleaned);



       return {

     PageNumber: this.pageNumber,

     PageSize: this.pageSize,

     SortField: this.sortField,

     SortOrder: this.sortOrder,

     invoiceInquirySearchDto: finalFilters,

    };

 }



   private sanitizeFilters(filters: any) {

     const cleanedFilters = { ...filters };



     Object.keys(cleanedFilters).forEach((key) => {

     const value = cleanedFilters[key];



      if (Array.isArray(value)) {

      let cleanedArray = value.filter((v) => v !== '__ALL__');



   // convert strings to numbers

    cleanedArray = cleanedArray.map((v) =>

     typeof v === 'string' ? Number(v) : v,

     );



    // optional: treat "all selected" as null

     cleanedFilters[key] = cleanedArray.length > 0 ? cleanedArray : null;

     }

     });



    return cleanedFilters;

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

 'Please hit search button before exporting data',

 );

 return;

 }



 this.loading = true;



 const rawFilters: InvoiceInquirySearchFilters = {

 ...this.invoiceInquirySearchFilters,

 };



    const exportQuery = this.buildExportQuery(rawFilters);



   this.invoiceInquiryService

 .exportInvoiceInquiry(exportQuery)

 .pipe(takeUntil(this.destroySubject))

 .subscribe({

 next: (result: ResponseResult<Blob>) => {

 if (result.isSuccess && result.responseData) {

 this.excelService.saveFile(

result.responseData,

 this.getTimestampedFileName(),

 );

  }

 this.loading = false;

 },

 error: (error) => this.onError(error),

 });

 }



    private buildExportQuery(filters: InvoiceInquirySearchFilters): any {

    const base: any = {

     upplierInfoID: filters.SupplierInfoID,

    InvoiceNumber: filters.InvoiceNumber,

     PONumber: filters.PONumber,

     RoleID: filters.RoleID,

     Status: filters.Status,

     };



      this.mapDateFields(filters, base);



    const cleaned = this.sanitizeFilters(base);

      return this.removeEmpty(cleaned);

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
