import { DatePipe, CommonModule, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageSeverity } from '@core/constants';
import { ResponseResult, TableColumn } from '@core/model/common';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import {
  ArchiveInvoiceSearchDto,
  ExceptionInvoiceSearchDto,
} from '@core/model/invoicing/invoice/invoice-info.dto';
import {
  MyInvoiceSearchConfig,
  buildMyInvoiceSearchConfig,
} from '@core/model/invoicing/invoice/invoice-search.configs';
import {
  ArchiveSearchQuery,
  ExportArchiveInvoiceQuery,
  ExportExceptionInvoiceQuery,
  MyInvoiceSearchModel,
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
  selector: 'app-archive-queue-search',
  standalone: true,
  providers: [DialogService, AlertService, DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    PrimeImportsModule,
    DynamicGridComponent,

    QuickSearchComponent,
  ],
  templateUrl: './archive-queue-search.component.html',
  styleUrl: './archive-queue-search.component.scss',
})
export class ArchiveQueueSearchComponent
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

  gridConfig: GridConfig<ArchiveInvoiceSearchDto> | null = null;
  @ViewChild('selectArchiveInvoiceTemplate', { static: false })
  selectArchiveInvoiceTemplate!: TemplateRef<any>;
  @ViewChild(DynamicGridComponent)
  dynamicGridComponent?: DynamicGridComponent<any>;

  //Quick Search
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
    private dynamicGridService: DynamicGridService<ExceptionInvoiceSearchDto>,
    private invDetailService: InvoiceDetailService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.dynamicGridService.setGridKey("archive-queue-grid");
    const stored = localStorage.getItem("archive-queue-search");
    if(stored){
      this.myInvoiceFilter = JSON.parse(stored);
    }
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
  }
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
  ngAfterViewInit(): void {
    this.initializeDynamicGrid();
  }

  search(event: MyInvoiceSearchModel) {
    this.myInvoiceFilter = event;
    setTimeout(() => {
      if (this.selectArchiveInvoiceTemplate) {
        this.initializeDynamicGrid();
      } else {
        this.loadData(1);
      }
    });
  }
  clear() {
    localStorage.removeItem("archive-queue-grid");
    localStorage.removeItem("archive-queue-search");
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
    let exportQuery: ExportArchiveInvoiceQuery = {
      SupplierName: this.myInvoiceFilter.suppName! || '',
      InvoiceNo: this.myInvoiceFilter.invNo! || '',
      PONo: this.myInvoiceFilter.poNo! || '',
    };
    this.loading = true;
    this.invDetailService
      .exportArchiveInvoice(exportQuery)
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
  onInvoiceValidate(): void {}

  private initializeDynamicGrid() {
    const columns = this.gridService.archiveQueueSearchColumn(
      this.selectArchiveInvoiceTemplate
    );
    this.dynamicGridService.setConfig({
      columns,
      data: [],
      totalRecords: 0,
      pageSize: 10,
      pageNumber: 1,
      sortField: '',
      sortOrder: -1,
      //TODO: enable actions when view functionality is available
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
          //TODO: enable allow when view functionality is avaialbe
          allow: false,
        },
      ],
      gridKey: 'archive-queue-grid'
    });
    this.loadData(1);
  }

  loadData(pageNumber: number) {
    const query: ArchiveSearchQuery = {
      SupplierName: this.myInvoiceFilter.suppName! || '',
      InvoiceNo: this.myInvoiceFilter.invNo! || '',
      PONo: this.myInvoiceFilter.poNo! || '',
      PageNumber: pageNumber,
      PageSize: this.gridConfig?.pageSize ?? 10,
      SortField: this.gridConfig?.sortField ?? '',
      SortOrder: this.gridConfig?.sortOrder ?? -1,
    };

    this.dynamicGridService.setLoading(true);
    this.dynamicGridService
    this.searchArchiveInvoice(query);
  }

  onLazyLoad(event: any): void {
    const pageNumber = event.pageNumber;
    const rows = event.pageSize ?? 10;
    const sortField = event.sortField || '';
    const sortOrder = event.sortOrder ?? -1;

    const query: ArchiveSearchQuery = {
      SupplierName: this.myInvoiceFilter.suppName! || '',
      InvoiceNo: this.myInvoiceFilter.invNo! || '',
      PONo: this.myInvoiceFilter.poNo! || '',
      PageNumber: pageNumber,
      PageSize: rows,
      SortField: sortField,
      SortOrder: sortOrder,
    };
    this.dynamicGridService.setLoading(true);
    this.searchArchiveInvoice(query);
  }

  searchArchiveInvoice(query: ArchiveSearchQuery) {
    query.SupplierName = this.myInvoiceFilter.suppName! || '';
    query.InvoiceNo = this.myInvoiceFilter.invNo! || '';
    query.PONo = this.myInvoiceFilter.poNo! || '';
    this.invDetailService
      .archiveQueueSearch(query)
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

  onRowCheckboxChange(checked: boolean, row: any): void {
    //todo: for validate button logic
    console.log('Checkbox toggled:', checked, row);
  }
  editInvoice(invoice: any) {
    const id = invoice.invoiceID;
    // this.router.navigate(['invoices', id, 'edit']);
    localStorage.setItem('archive-queue-search',JSON.stringify(this.myInvoiceFilter));
    this.router.navigate(['invoices', id, 'edit'], {
      state: { returnUrl: this.router.url },
    });
  }

  getTimestampedFileName(): string {
    const timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    return `ArchiveInvoice_${timestamp}.xlsx`;
  }
}
