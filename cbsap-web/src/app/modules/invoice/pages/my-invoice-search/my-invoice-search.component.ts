import { FormsModule } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { ResponseResult, TableColumn } from '@core/model/common';
import { Subject, filter, takeUntil } from 'rxjs';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import { InvMyInvoiceSearchDto } from '@core/model/invoicing/invoice/invoice-info.dto';
import { Router } from '@angular/router';
import { AlertService, ExcelService, GridService, LoaderService } from '@core/services';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { DialogService } from 'primeng/dynamicdialog';
import { InvoiceDetailService } from '@core/services/invoicing/invoice-detail.service';
import {
  ExportMyInvoiceQuery,
  MyInvoiceSearchModel,
  MyInvoiceSearchQuery,
} from '@core/model/invoicing/invoicing.index';
import { MessageSeverity } from '@core/constants';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import {
  MyInvoiceSearchConfig,
  buildMyInvoiceSearchConfig,
} from '@core/model/invoicing/invoice/invoice-search.configs';
import { MyInvoiceAdvanceSearchComponent } from '../my-invoice-advance-search/my-invoice-advance-search.component';
import { ADVANCESEARCH_CONSTANT } from '@core/constants/advance-search/advance-search-constants';
import { LoaderComponent } from '@shared/loader/loader.component';

@Component({
  selector: 'app-my-invoice-search',
  standalone: true,
  providers: [DialogService, AlertService, DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    PrimeImportsModule,
    DynamicGridComponent,
    QuickSearchComponent,
    LoaderComponent,
  ],
  templateUrl: './my-invoice-search.component.html',
  styleUrl: './my-invoice-search.component.scss',
})
export class MyInvoiceSearchComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private destroySubject: Subject<void> = new Subject();

  columns: TableColumn[] = [];
  sizes: any;

  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  sortField?: string = '';
  sortOrder: number = 1;

  gridConfig: GridConfig<InvMyInvoiceSearchDto> | null = null;
  @ViewChild('selectInvoiceTemplate', { static: false })
  selectInvoiceTemplate!: TemplateRef<any>;
  @ViewChild(DynamicGridComponent)
  dynamicGridComponent?: DynamicGridComponent<any>;

  //Quick Search
  readonly searchConfig: MyInvoiceSearchConfig = buildMyInvoiceSearchConfig([
    {
      label: 'Validate',
      icon: 'pi pi-shield',
      severity: 'contrast',
      action: () => this.onInvoiceValidate(),
      outlined: false,
    },
  ]);

  myInvoiceFilter: MyInvoiceSearchModel = {
    suppName: '',
    invNo: '',
    poNo: '',
  };

  selectedInvoices: InvMyInvoiceSearchDto[] = [];

  constructor(
    private router: Router,
    private gridService: GridService,
    private message: AlertService,
    private excelService: ExcelService,
    private dynamicGridService: DynamicGridService<InvMyInvoiceSearchDto>,
    private invDetailService: InvoiceDetailService,
    private datePipe: DatePipe,
    private dialogService: DialogService,
    private loaderService: LoaderService,
  ) {}

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
  ngAfterViewInit(): void {
    this.initializeDynamicGrid();
  }
  ngOnInit(): void {
    this.dynamicGridService.setGridKey("myinvoice-grid");
    const stored = localStorage.getItem("myinvoice-search");
    if(stored){
      this.myInvoiceFilter = JSON.parse(stored);
    }    
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
  }

  search(event: MyInvoiceSearchModel) {
    console.log(this.myInvoiceFilter);
    this.myInvoiceFilter = event;
    console.log(event);
    setTimeout(() => {
      if (this.selectInvoiceTemplate) {
        this.initializeDynamicGrid();
      } else {
        this.loadData(1);
      }
    });
  }
  clear() {
    localStorage.removeItem("myinvoice-search");
    localStorage.removeItem("myinvoice-grid");
    this.searchConfig.model.suppName = '';
    this.searchConfig.model.invNo = '';
    this.searchConfig.model.poNo = '';
    this.myInvoiceFilter = {
      suppName: '',
      invNo: '',
      poNo: '',
    };
    this.pageNumber = 1;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.dynamicGridComponent?.resetTable();
    this.loadData(1);
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
    let exportQuery: ExportMyInvoiceQuery = {
      SupplierName: this.myInvoiceFilter.suppName! || '',
      InvoiceNo: this.myInvoiceFilter.invNo! || '',
      PONo: this.myInvoiceFilter.poNo! || '',
    };
    this.loading = true;
    this.invDetailService
      .exportMyInvoices(exportQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Blob>) => {
          if (result.isSuccess && result.responseData) {
            const blob = result.responseData;
            this.excelService.saveFile(blob, this.getTimestampedFileName());
          }
          this.loading = false;
        },
      });
  }

  onInvoiceValidate(): void {
    if (!this.selectedInvoices.length) {
      this.message.showToast(
        MessageSeverity.warn,
        'Warning',
        'Select a record to validate'
      );
      return;
    }

    this.loaderService.show();

    const invoiceIds = this.selectedInvoices.map(x => x.invoiceID);

    this.invDetailService
      .validateInvoices(invoiceIds)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (response) => {

          if (response.isSuccess) {
            this.message.showToast(
              MessageSeverity.success,
              'Success',
              'Selected records successfully validated'
            );

            this.selectedInvoices = [];
            this.loadData(1);
          }

          this.loaderService.hide();
        },
        error: () => {
          this.loaderService.hide();

          this.message.showToast(
            MessageSeverity.error,
            'Error',
            'Failed to validate records'
          );
        },
      });
  }

  private initializeDynamicGrid() {
    const columns = this.gridService.myInvoiceSearchColumn(
      this.selectInvoiceTemplate
    );
    this.dynamicGridService.setConfig({
      columns,
      data: [],
      totalRecords: 0,
      pageSize: 10,
      pageNumber: 1,
      sortField: '',
      sortOrder: -1,
      // actions: [
      //   {
      //     label: '',
      //     icon: 'pi pi-pencil',
      //     action: (item) => this.editInvoice(item),
      //   },
      // ],
      loading: false,
      rowClick: [
        {
          clickable: (item) => this.editInvoice(item),
          allow: true,
        },
      ],
      gridKey: 'myinvoice-grid'
    });
    this.loadData(1);
  }

  loadData(pageNumber: number) {
    const query: MyInvoiceSearchQuery = {
      SupplierName: this.myInvoiceFilter.suppName! || '',
      InvoiceNo: this.myInvoiceFilter.invNo! || '',
      PONo: this.myInvoiceFilter.poNo! || '',
      PageNumber: pageNumber,
      PageSize: this.gridConfig?.pageSize ?? 10,
      SortField: this.gridConfig?.sortField ?? '',
      SortOrder: this.gridConfig?.sortOrder ?? -1,
    };

    this.dynamicGridService.setLoading(true);
    this.searchMyInvoice(query);
  }

  onLazyLoad(event: any): void {
    const pageNumber = event.pageNumber;
    const rows = event.pageSize ?? 10;
    const sortField = event.sortField || '';
    const sortOrder = event.sortOrder ?? -1;

    const query: MyInvoiceSearchQuery = {
      SupplierName: this.myInvoiceFilter.suppName! || '',
      InvoiceNo: this.myInvoiceFilter.invNo! || '',
      PONo: this.myInvoiceFilter.poNo! || '',
      PageNumber: pageNumber,
      PageSize: rows,
      SortField: sortField,
      SortOrder: sortOrder,
    };
    this.dynamicGridService.setLoading(true);

    this.searchMyInvoice(query);
  }

  searchMyInvoice(query: MyInvoiceSearchQuery) {
    query.SupplierName = this.myInvoiceFilter.suppName! || '';
    query.InvoiceNo = this.myInvoiceFilter.invNo! || '';
    query.PONo = this.myInvoiceFilter.poNo! || '';
    this.invDetailService
      .myInvoiceSearch(query)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.dynamicGridService.updateData(
              res.responseData?.data ?? [],
              res.responseData?.totalCount ?? 0,
              query.PageSize
            );

            this.totalRecords = res.responseData?.totalCount ?? 0;
          }
        },
        error: () => {
          this.dynamicGridService.setLoading(false);
        },
      });
  }

  onRowCheckboxChange(checked: boolean, row: InvMyInvoiceSearchDto): void {
    if (checked) {
      const exists = this.selectedInvoices.some(
        (x) => x.invoiceID === row.invoiceID
      );

      if (!exists) {
        this.selectedInvoices.push(row);
      }
    } else {
      this.selectedInvoices = this.selectedInvoices.filter(
        (x) => x.invoiceID !== row.invoiceID
      );
    }
  }

  editInvoice(invoice: any) {
    const id = invoice.invoiceID;
    /*by pass this */
    localStorage.setItem('myinvoice-search',JSON.stringify(this.myInvoiceFilter));
    this.router.navigate(['invoices', id, 'edit'], {
      state: { returnUrl: this.router.url },
    });
  }

  getTimestampedFileName(): string {
    const timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    return `MyInvoices_${timestamp}.xlsx`;
  }
  
  advanceSearch() {

    this.dialogService.open(MyInvoiceAdvanceSearchComponent, {
      width: '900px',
      style: { minHeight: '200px' },
      modal: true,
      closable: true,
      baseZIndex: 1200,
      header : 'Advance Search',
      data :{
        formName : ADVANCESEARCH_CONSTANT.FORMNAME.MYINVOICEQUEUE
      }
    });


  }

}
