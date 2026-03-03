import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DatePipe,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import {
  CustomButton,
  SearchField,
} from '@core/model/quick-search/QuickSearchModel';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { TableColumn } from '@core/model/common/grid-column';
import { getStatusFilterOptions } from '@core/constants/common/statusFilterOptions';
import { AlertService, ExcelService, GridService, LookUpsService } from '@core/services';
import { MessageSeverity } from '@core/constants';
import { YesnoPipe } from '@shared/pipes/yesno.pipe';
import { SearchGoodsReceiptLookupDto } from '@core/model/goods-receipt/search-goods-receipt.dto';
import {
  ExportGoodsReceiptsQuery,
  SearchGoodsReceiptQuery,
} from '@core/model/goods-receipt/search-goods-receipt.query';
import { Pagination, ResponseResult } from '@core/model/common';
import { TableLazyLoadEvent } from 'primeng/table';

interface GoodsReceiptSearchModel {
  entity: string;
  supplier: string;
  goodsReceiptNumber: string;
  active: boolean | null;
  deliveryDateFrom: Date | null;
  deliveryDateTo: Date | null;
}

interface GoodsReceiptGridItem {
  entity: string;
  supplier: string;
  goodsReceiptNumber: string;
  deliveryNote: string;
  active: boolean;
  deliveryDate: string;
}

@Component({
  selector: 'app-goods-receipt',
  standalone: true,
  imports: [
    PrimeImportsModule,
    QuickSearchComponent,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    DatePipe,
    YesnoPipe,
  ],
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.scss'],
})
export class GoodsReceiptComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly sortFieldMap: Record<string, string> = {
    entity: 'entity',
    supplier: 'supplier',
    goodsReceiptNumber: 'goodsReceiptNumber',
    deliveryNote: 'deliveryNote',
    active: 'active',
    deliveryDate: 'deliveryDate',
  };

  constructor(
    private lookUpsService: LookUpsService,
    private excelService: ExcelService,
    private alertService: AlertService,
    private gridService: GridService
  ) {}

  goodsReceiptSearchModel: GoodsReceiptSearchModel = {
    entity: '',
    supplier: '',
    goodsReceiptNumber: '',
    active: null,
    deliveryDateFrom: null,
    deliveryDateTo: null,
  };

  goodsReceiptSearchFields: SearchField<GoodsReceiptSearchModel>[] = [
    {
      key: 'entity',
      label: 'Entity',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'supplier',
      label: 'Supplier',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'goodsReceiptNumber',
      label: 'Goods Receipt Number',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'active',
      label: 'Active Status',
      type: 'bool',
      fieldType: 'dropdown',
      options: getStatusFilterOptions(),
    },
    {
      key: 'deliveryDateFrom',
      label: 'Delivery Date From',
      type: 'date',
      fieldType: 'calendar',
    },
    {
      key: 'deliveryDateTo',
      label: 'Delivery Date To',
      type: 'date',
      fieldType: 'calendar',
    },
  ];

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

  columns: TableColumn[] = [];

  goodsReceipts: GoodsReceiptGridItem[] = [];

  totalRecords = 0;
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortOrder = 1;
  triggeredBySearch = false;
  loading = false;

  @ViewChild('dtGoodsReceipts') table: Table | undefined;

  ngOnInit(): void {
    this.columns = this.gridService.goodsReceiptManagementColumn();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(filters: GoodsReceiptSearchModel): void {
    this.goodsReceiptSearchModel = {
      entity: filters?.entity ?? '',
      supplier: filters?.supplier ?? '',
      goodsReceiptNumber: filters?.goodsReceiptNumber ?? '',
      active: filters?.active ?? null,
      deliveryDateFrom: filters?.deliveryDateFrom ?? null,
      deliveryDateTo: filters?.deliveryDateTo ?? null,
    };

    this.triggeredBySearch = true;
    this.pageNumber = 1;
    this.loadGoodsReceipts();
  }

  onClear(): void {
    this.goodsReceiptSearchModel = {
      entity: '',
      supplier: '',
      goodsReceiptNumber: '',
      active: null,
      deliveryDateFrom: null,
      deliveryDateTo: null,
    };

    this.triggeredBySearch = true;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.table?.reset();
    this.loadGoodsReceipts();
  }

  onExport(): void {
    if (this.totalRecords === 0) {
      this.alertService.showToast(
        MessageSeverity.warn,
        'Warning',
        'Please hit search button before exporting data.'
      );
      return;
    }

    const exportQuery = this.buildExportQuery();
    this.loading = true;

    this.lookUpsService
      .exportGoodsReceipts(exportQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: ResponseResult<Blob>) => {
          if (result.isSuccess && result.responseData) {
            const fileName = this.excelService.excelFileName('GoodsReceipts');
            this.excelService.saveFile(result.responseData, fileName);
          } else {
            this.alertService.showToast(
              MessageSeverity.warn,
              'Export',
              'No data available to export.'
            );
          }
          this.loading = false;
        },
        error: () => {
          this.alertService.showToast(
            MessageSeverity.error,
            'Export Failed',
            'Unable to export goods receipts at this time.'
          );
          this.loading = false;
        },
      });
  }

  onAdvancedSearch(): void {
    // TODO: wire advanced search modal or navigation.
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    if (this.triggeredBySearch) {
      this.triggeredBySearch = false;
      return;
    }

    this.sortField = event.sortField ? String(event.sortField) : '';
    this.sortOrder = event.sortOrder ? event.sortOrder : 1;
    this.loading = true;
    this.pageNumber = event.first !== undefined && event.rows
      ? Math.floor(event.first / event.rows) + 1
      : 1;
    this.pageSize = event.rows ?? this.pageSize;
    this.loadGoodsReceipts();
  }

  private loadGoodsReceipts(): void {
    const query = this.buildSearchQuery();
    this.loading = true;

    this.lookUpsService
      .goodsReceiptSearchLookUp(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: ResponseResult<Pagination<SearchGoodsReceiptLookupDto>>) => {
          if (result.isSuccess && result.responseData) {
            this.goodsReceipts = (result.responseData.data ?? []).map((item) =>
              this.mapGoodsReceiptToGridItem(item)
            );
            this.totalRecords = result.responseData.totalCount;
          } else {
            this.goodsReceipts = [];
            this.totalRecords = 0;
          }

          this.loading = false;
          this.triggeredBySearch = false;
        },
        error: () => {
          this.goodsReceipts = [];
          this.totalRecords = 0;
          this.loading = false;
          this.triggeredBySearch = false;
        },
      });
  }

  private buildSearchQuery(): SearchGoodsReceiptQuery {
    const sortField = this.mapSortField(this.sortField);

    const query: SearchGoodsReceiptQuery = {
      entity: this.goodsReceiptSearchModel.entity?.trim() || null,
      supplier: this.goodsReceiptSearchModel.supplier?.trim() || null,
      goodsReceiptNumber: this.goodsReceiptSearchModel.goodsReceiptNumber?.trim() || null,
      active: this.goodsReceiptSearchModel.active,
      deliveryDateFrom: this.goodsReceiptSearchModel.deliveryDateFrom
        ? this.formatDate(this.goodsReceiptSearchModel.deliveryDateFrom)
        : null,
      deliveryDateTo: this.goodsReceiptSearchModel.deliveryDateTo
        ? this.formatDate(this.goodsReceiptSearchModel.deliveryDateTo)
        : null,
      PageNumber: this.pageNumber || 1,
      PageSize: this.pageSize,
      SortField: sortField,
      SortOrder: this.sortOrder,
    };

    if (!sortField) {
      delete query.SortField;
      delete query.SortOrder;
    }

    return query;
  }

  private mapSortField(field: string): string | undefined {
    if (!field) {
      return undefined;
    }

    return this.sortFieldMap[field] ?? field;
  }

  private buildExportQuery(): ExportGoodsReceiptsQuery {
    const searchQuery = this.buildSearchQuery();

    return {
      entity: searchQuery.entity,
      supplier: searchQuery.supplier,
      goodsReceiptNumber: searchQuery.goodsReceiptNumber,
      active: searchQuery.active,
      deliveryDateFrom: searchQuery.deliveryDateFrom,
      deliveryDateTo: searchQuery.deliveryDateTo,
    };
  }

  private mapGoodsReceiptToGridItem(
    goodsReceipt: SearchGoodsReceiptLookupDto
  ): GoodsReceiptGridItem {
    return {
      entity: goodsReceipt.entity ?? '',
      supplier: goodsReceipt.supplier ?? '',
      goodsReceiptNumber: goodsReceipt.goodsReceiptNumber ?? '',
      deliveryNote: goodsReceipt.deliveryNote ?? '',
      active: this.toBoolean(goodsReceipt.active),
      deliveryDate: goodsReceipt.deliveryDate ?? '',
    };
  }

  private toBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.toLowerCase();
      return ['yes', 'true', '1', 'y', 't'].includes(normalized);
    }

    if (typeof value === 'number') {
      return value !== 0;
    }

    return false;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
