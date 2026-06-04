import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageSeverity } from '@core/constants';
import { ResponseResult, TableColumn } from '@core/model/common';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import {
  buildSearchPOConfig,
  getDefaultSearchPOModel,
  SearchPOConfig,
} from '@core/model/purchase-order/po-search.config';
import { POSearchDto } from '@core/model/purchase-order/po-search.dto';
import {
  ExportPOSearchQuery,
  POSearchQuery,
  SearchPOModel,
} from '@core/model/purchase-order/po.query';
import { AlertService, ExcelService, GridService } from '@core/services';
import { PurchaseOrderService } from '@core/services/purchase-order/purchase-order.service';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-po-reference',
  standalone: true,
  providers: [AlertService],
  imports: [
    CommonModule,
    FormsModule,
    PrimeImportsModule,
    DynamicGridComponent,
    QuickSearchComponent,
  ],
  templateUrl: './po-reference.component.html',
  styleUrl: './po-reference.component.scss',
})
export class PoReferenceComponent implements OnInit, OnDestroy {
  private destroySubject: Subject<void> = new Subject();
  readonly searchPOConfig: SearchPOConfig = buildSearchPOConfig();

  columns: TableColumn[] = [];
  sizes: any;

  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  sortField?: string = '';
  sortOrder: number = 1;

  gridConfig: GridConfig<POSearchDto> | null = null;

  searchFilters: Record<string, any> = {
    entityName: '',
    poNo: '',
    supplier: '',
    isActive: null,
  };

  @ViewChild(DynamicGridComponent)
  dynamicGridComponent?: DynamicGridComponent<any>;

  constructor(
    private gridService: GridService,
    private dynamicGridService: DynamicGridService<POSearchDto>,
    private purchaseOrderService: PurchaseOrderService,
    private message: AlertService,
    private datePipe: DatePipe,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
    this.initializeDynamicGrid();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  private initializeDynamicGrid() {
    const columns = this.gridService.POSearchColumn();

    this.dynamicGridService.setConfig({
      columns,
      data: [],
      totalRecords: 0,
      pageSize: 10,
      pageNumber: 1,
      sortField: '',
      sortOrder: -1,
      loading: false,
      rowClick: [
        {
          allow: false,
        },
      ],
    });
  }

  onLazyLoad(event: any): void {
    const pageNumber = event.pageNumber;

    const rows = event.pageSize ?? 10;
    const sortField = event.sortField || '';
    const sortOrder = event.sortOrder ?? -1;
    const searchCriteria: SearchPOModel = this.searchFilters as SearchPOModel;

    const query: POSearchQuery = {
      EntityName: searchCriteria.entityName! ?? null,
      PONo: searchCriteria.poNo! ?? null,
      Supplier: searchCriteria.supplierName! ?? null,
      IsActive: searchCriteria.isActive! ?? null,
      PageNumber: pageNumber,
      PageSize: rows,
      SortField: sortField,
      SortOrder: sortOrder,
    };
    this.dynamicGridService.setLoading(true);
    this.poSearch(query);
  }
  loadData(pageNumber: number) {
    const searchCriteria: SearchPOModel = this.searchFilters as SearchPOModel;

    let query: POSearchQuery = {
      PONo: searchCriteria.poNo ?? null,
      EntityName: searchCriteria.entityName ?? null,
      Supplier: searchCriteria.supplierName ?? null,
      IsActive: searchCriteria.isActive ?? null,
      PageNumber: pageNumber,
      PageSize: this.gridConfig?.pageSize ?? 10,
      SortField: this.gridConfig?.sortField ?? '',
      SortOrder: this.gridConfig?.sortOrder ?? -1,
    };

    this.dynamicGridService.setLoading(true);
    this.poSearch(query);
  }

  search(event: SearchPOModel) {
    this.searchFilters = event;
    this.loadData(1);
  }

  poSearch(query: POSearchQuery) {
    this.purchaseOrderService
      .poSearch(query)
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
      });
  }

  clear() {
    this.searchFilters = getDefaultSearchPOModel();
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
    const searchCriteria: SearchPOModel = this.searchFilters as SearchPOModel;
    let exportQuery: ExportPOSearchQuery = {
      PONo: searchCriteria.poNo ?? null,
      EntityName: searchCriteria.entityName ?? null,
      Supplier: searchCriteria.supplierName ?? null,
      IsActive: searchCriteria.isActive ?? null,
    };
    this.purchaseOrderService
      .exportPO(exportQuery)
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
  getTimestampedFileName(): string {
    const timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    return `PurchaseOrders_${timestamp}.xlsx`;
  }
}
