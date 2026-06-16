import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageSeverity } from '@core/constants';
import { PO_CONSTANT } from '@core/constants/purchase-order/purchase-order.constants';
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
import { first, Subject, takeUntil } from 'rxjs';

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


  columns: TableColumn[] = [];
  sizes: any;

  totalRecords: number = 0;
  totalPages : number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  sortField?: string = '';
  sortOrder: number = 1;

  gridConfig: GridConfig<POSearchDto> | null = null;
  readonly searchPOConfig: SearchPOConfig = buildSearchPOConfig();
  searchFilters: SearchPOModel = {
    entityName: '',
    poNo: '',
    supplierName: '',
    isActive: null,
    goodReceipt:'',
  };

  @ViewChild(DynamicGridComponent)
  dynamicGridComponent?: DynamicGridComponent<any>;

  constructor(
    private gridService: GridService,
    private dynamicGridService: DynamicGridService<POSearchDto>,
    private purchaseOrderService: PurchaseOrderService,
    private message: AlertService,
    private datePipe: DatePipe,
    private excelService: ExcelService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.dynamicGridService.setGridKey('purchase-order-grid');
    const stored = localStorage.getItem("purchase-order-search");
    if(stored){
      this.searchFilters = JSON.parse(stored);

      console.log(this.searchFilters)

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
          clickable: (item) => this.ViewPOReference(item),
          allow: true,
        },
      ],
      gridKey: 'purchase-order-grid'
    });
  }

  onLazyLoad(event: any): void {

    const pageNumber = event.pageNumber;

    const rows = event.pageSize ?? 10;
    const sortField = event.sortField || '';
    const sortOrder = event.sortOrder ?? -1;
    const searchCriteria: SearchPOModel = this.searchFilters as SearchPOModel;

    var query: POSearchQuery = {
      EntityName: searchCriteria.entityName! ?? null,
      PONo: searchCriteria.poNo! ?? null,
      SupplierName: searchCriteria.supplierName! ?? null,
      IsActive: searchCriteria.isActive! ?? null,
      GoodReceipt : searchCriteria.goodReceipt! ?? null,
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
      SupplierName: searchCriteria.supplierName ?? null,
      IsActive: searchCriteria.isActive ?? null,
      GoodReceipt : searchCriteria.goodReceipt! ?? null,
      PageNumber: pageNumber,
      PageSize: this.gridConfig?.pageSize ?? 10,
      SortField: this.gridConfig?.sortField ?? '',
      SortOrder: this.gridConfig?.sortOrder ?? -1,
    };



    this.dynamicGridService.setLoading(true);
    this.poSearch(query);
  }

  ViewPOReference(item: any) {
    const id = item.purchaseOrderID;

    const searchCriteria: SearchPOModel = this.searchFilters as SearchPOModel;

    let query: POSearchQuery = {
      PONo: searchCriteria.poNo ?? null,
      EntityName: searchCriteria.entityName ?? null,
      SupplierName: searchCriteria.supplierName ?? null,
      IsActive: searchCriteria.isActive ?? null,
      GoodReceipt : searchCriteria.goodReceipt! ?? null,
      PageNumber: this.pageNumber,
      PageSize: this.gridConfig?.pageSize ?? 10,
      SortField: this.gridConfig?.sortField ?? '',
      SortOrder: this.gridConfig?.sortOrder ?? -1,
      TotalPage: this.totalPages
    };

  

    localStorage.setItem('purchase-order-search',JSON.stringify(this.searchFilters));
    localStorage.setItem(PO_CONSTANT.SEARCH_FILTER_LOCALSTORAGE.PURCHASEORDER,JSON.stringify(query));

    this.router.navigate(['/reference-data-lookup', 'view-purchaseorder', id]);
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
              query.PageSize,
            );


            this.totalRecords = res.responseData?.totalCount ?? 0;
            this.pageNumber = query.PageNumber ;
           this.totalPages = res.responseData?.totalPages ?? 0;
              
          }
        },
      });
  }


  clear() {
    this.searchFilters = getDefaultSearchPOModel();

    localStorage.removeItem("purchase-order-grid");
    localStorage.removeItem("purchase-order-search");   
  
    
    this.searchFilters = {
      entityName: '',
      poNo: '',
      supplierName: '',
      isActive: null,
      goodReceipt : ''
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
    const searchCriteria: SearchPOModel = this.searchFilters as SearchPOModel;
    let exportQuery: ExportPOSearchQuery = {
      PONo: searchCriteria.poNo ?? null,
      EntityName: searchCriteria.entityName ?? null,
      SupplierName: searchCriteria.supplierName ?? null,
      IsActive: searchCriteria.isActive ?? null,
      GoodReceipt : searchCriteria.goodReceipt! ?? null,
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
