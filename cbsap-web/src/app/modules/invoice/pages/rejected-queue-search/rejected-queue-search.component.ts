import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageSeverity } from '@core/constants';
import { ResponseResult, TableColumn } from '@core/model/common';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import { RejectedInvoiceSearchDto } from '@core/model/invoicing/invoice/invoice-info.dto';
import {
  MyInvoiceSearchConfig,
  buildMyInvoiceSearchConfig,
} from '@core/model/invoicing/invoice/invoice-search.configs';
import {
  ExportMyInvoiceQuery,
  MyInvoiceSearchModel,
  RejectedSearchQuery,
} from '@core/model/invoicing/invoicing.index';
import { AlertService, ExcelService, GridService } from '@core/services';
import { InvoiceDetailService } from '@core/services/invoicing/invoice-detail.service';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-rejected-queue-search',
  standalone: true,
  providers: [DialogService, AlertService, DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    PrimeImportsModule,
    DynamicGridComponent,
    QuickSearchComponent,
  ],
  templateUrl: './rejected-queue-search.component.html',
  styleUrl: './rejected-queue-search.component.scss',
})
export class RejectedQueueSearchComponent
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

  gridConfig: GridConfig<RejectedInvoiceSearchDto> | null = null;
  @ViewChild(DynamicGridComponent)
  dynamicGridComponent?: DynamicGridComponent<any>;
  readonly searchConfig: MyInvoiceSearchConfig = buildMyInvoiceSearchConfig();

  myInvoiceFilter: MyInvoiceSearchModel = {
    suppName: '',
    invNo: '',
    poNo: '',
  };
  /**
   *
   */
  constructor(
    private router: Router,
    private gridService: GridService,
    private message: AlertService,
    private excelService: ExcelService,
    private dynamicGridService: DynamicGridService<RejectedInvoiceSearchDto>,
    private invDetailService: InvoiceDetailService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
    this.initializeDynamicGrid();
  }
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  search(event: MyInvoiceSearchModel) {
    this.myInvoiceFilter = event;
    this.loadData(1);
  }
  clear() {
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
      .exportRejectInvoice(exportQuery)
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
  private initializeDynamicGrid() {
    const columns = this.gridService.rejectQueueSearchColumn();
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
    });
    this.loadData(1);
  }

  loadData(pageNumber: number) {
    const query: RejectedSearchQuery = {
      SupplierName: this.myInvoiceFilter.suppName! || '',
      InvoiceNo: this.myInvoiceFilter.invNo! || '',
      PONo: this.myInvoiceFilter.poNo! || '',
      PageNumber: pageNumber,
      PageSize: this.gridConfig?.pageSize ?? 10,
      SortField: this.gridConfig?.sortField ?? '',
      SortOrder: this.gridConfig?.sortOrder ?? -1,
    };

    this.dynamicGridService.setLoading(true);
    this.searchRejectedInvoice(query);
  }

  onLazyLoad(event: any): void {
    const pageNumber = event.pageNumber;
    const rows = event.pageSize ?? 10;
    const sortField = event.sortField || '';
    const sortOrder = event.sortOrder ?? -1;

    const query: RejectedSearchQuery = {
      SupplierName: this.myInvoiceFilter.suppName! || '',
      InvoiceNo: this.myInvoiceFilter.invNo! || '',
      PONo: this.myInvoiceFilter.poNo! || '',
      PageNumber: pageNumber,
      PageSize: rows,
      SortField: sortField,
      SortOrder: sortOrder,
    };
    this.dynamicGridService.setLoading(true);
    this.searchRejectedInvoice(query);
  }

  searchRejectedInvoice(query: RejectedSearchQuery) {
    query.SupplierName = this.myInvoiceFilter.suppName! || '';
    query.InvoiceNo = this.myInvoiceFilter.invNo! || '';
    query.PONo = this.myInvoiceFilter.poNo! || '';
    this.invDetailService
      .rejectedQueueSearch(query)
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

  editInvoice(invoice: any) {
    const id = invoice.invoiceID;
    //this.router.navigate(['invoices', id, 'edit']);

    this.router.navigate(['invoices', id, 'edit'], {
      state: { returnUrl: this.router.url },
    });
  }

  getTimestampedFileName(): string {
    const timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    return `RejectedQueue_${timestamp}.xlsx`;
  }
}
