import { CommonModule, DatePipe, NgFor, NgSwitchCase } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResponseResult } from '@core/model/common';
import { TableColumn } from '@core/model/common/grid-column';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import {
  SearchPoLinesDto,
  SearchPOResult,
} from '@core/model/purchase-order/po-lines.dto';
import {
  SearchPOLinesQuery,
  SearchPOLinesModel,
} from '@core/model/purchase-order/po-lines.query';
import {
  buildSearchPOLinesConfig,
  getDefaultSearchPOLinesModel,
  SearchPOLinesConfig,
} from '@core/model/purchase-order/po-lines-search.config';
import { PoLinesSharedService } from '@core/services/purchase-order/po-lines-shared.service';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { PurchaseOrderService } from './../../../../../core/services/purchase-order/purchase-order.service';

@Component({
  selector: 'app-search-purchase-order',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeImportsModule, NgFor, NgSwitchCase],
  templateUrl: './search-purchase-order.component.html',
  styleUrl: './search-purchase-order.component.scss',
})
export class SearchPurchaseOrderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  readonly searchPOlinesConfig: SearchPOLinesConfig =
    buildSearchPOLinesConfig();
  fieldRows: any[][] = [];

  filters: Record<string, any> = {
    suppName: '',
    suppABN: '',
    poNo: '',
    poDateFrom: null,
    poDateTo: null,
    deliveryNo: '',
    isAvailableOrder: true,
    excludesMatchPOLineIds: [],
  };

  columns: TableColumn[] = [];
  sizes: any;

  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  sortField?: string = '';
  sortOrder: number = 1;
  excludesMatchPOLineIds: number[] = [];
  gridConfig: GridConfig<SearchPoLinesDto> | null = null;

  @ViewChild(DynamicGridComponent)
  dynamicGridComponent?: DynamicGridComponent<any>;

  constructor(
    private poLinesSharedService: PoLinesSharedService,
    private purchaseOrderService: PurchaseOrderService,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private datePipe: DatePipe
  ) {
    this.excludesMatchPOLineIds =
      (this.config.data?.excludesMatchPOLineIds as number[]) ?? null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.prepareFieldRows();
    this.sharedFillInvoiceField();
  }

  private sharedFillInvoiceField() {
    this.poLinesSharedService
      .getSharedInvDataToSearchPO()
      .pipe(takeUntil(this.destroy$))
      .subscribe((values) => {
        this.filters = { ...this.filters, ...values! };
      });
  }

  prepareFieldRows() {
    const chunkSize = 3;
    const fields = this.searchPOlinesConfig.fields || [];

    const displayFields = [];
    for (let i = 0; i < fields.length; i += chunkSize) {
      displayFields.push(fields.slice(i, i + chunkSize));
    }
    this.fieldRows = displayFields;
  }

  search() {
    this.searchPO();
  }

  clear() {
    this.filters = getDefaultSearchPOLinesModel();
    this.sharedFillInvoiceField();
  }
  cancel() {
    this.dialogRef.close();
  }

  /**  Search and Configuration */

  searchPO() {
    const searchCriteria: SearchPOLinesModel = this
      .filters as SearchPOLinesModel;
    searchCriteria.ExcludesMatchPOLineIds = this.excludesMatchPOLineIds.length
      ? this.excludesMatchPOLineIds
      : null;

    let query: SearchPOLinesQuery = {
      SupplierName: searchCriteria.suppName! ?? '',
      SupplierTaxID: searchCriteria.suppABN! ?? '',
      PONo: searchCriteria.poNo! ?? '',
      PODateFrom: searchCriteria.poDateFrom
        ? this.datePipe.transform(searchCriteria.poDateFrom!, 'yyyy-MM-dd')
        : '',
      PODateTo: searchCriteria.poDateTo
        ? this.datePipe.transform(searchCriteria.poDateTo!, 'yyyy-MM-dd')
        : '',
      SupplierNo: searchCriteria.supplierNo! ?? '',
      isAvailableOrder: searchCriteria.isAvailableOrder,
      ExcludesMatchPOLineIds: searchCriteria.ExcludesMatchPOLineIds ?? null,
    };

    if (query.ExcludesMatchPOLineIds == null) {
      delete query.ExcludesMatchPOLineIds;
    }

    this.purchaseOrderService
      .searchPOLines(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            const lines = res.responseData?.flatMap((items) => items.poLines);

            const result: SearchPOResult = {
              polines: lines!,
              isAvailableOrder: query.isAvailableOrder,
            };

            this.dialogRef.close(result);
          }
        },
        error: (error: ResponseResult<SearchPoLinesDto>) => {
          this.dialogRef.close(error.responseData);
        },
      });
  }
}
