import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableColumn } from '@core/model/common';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import {
  InvSearchSupplierDto,
  InvSupplierLookUpQuery,
} from '@core/model/invoicing/invoicing.index';
import { GridService, LookUpsService } from '@core/services';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-invoice-supplier-search',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    PrimeImportsModule,
    NgIf,
    DynamicGridComponent,
  ],
  templateUrl: './invoice-supplier-search.component.html',
  styleUrl: './invoice-supplier-search.component.scss',
})
export class InvoiceSupplierSearchComponent implements OnInit, OnDestroy {
  @ViewChild('dtSearchSupplier') table: Table | undefined;
  private destroySubject: Subject<void> = new Subject();

  filterBySupplierID: string = '';
  filterBySupplierName: string = '';

  supplierPagination: InvSearchSupplierDto[] = [];
  columns: TableColumn[] = [];
  sizes: any;

  isShowSearchSupplier: boolean = false;
  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  sortField?: string = '';
  sortOrder: number = 1;

  gridConfig: GridConfig<InvSearchSupplierDto> | null = null;
  /**
   *
   */
  constructor(
    private lookOptionService: LookUpsService,
    private dynamicGridService: DynamicGridService<InvSearchSupplierDto>,
    private gridService: GridService,
    private dialogRef: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
    this.initializeDynamicGrid();
  }
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  /** Grid Set Up */
  private initializeDynamicGrid() {
    const columns = this.gridService.invSupplierSearchLookUpGridColumn();
    this.dynamicGridService.setConfig({
      columns,
      data: [],
      totalRecords: 0,
      pageSize: 10,
      pageNumber: 1,
      sortField: '',
      sortOrder: -1,
      actions: [
        {
          label: '',
          icon: 'pi pi-plus',
          action: (item) => this.selectSupplier(item),
        },
      ],
      loading: false,
    });
  }
  onLazyLoad(event: any): void {
    const pageNumber = event.pageNumber;
    const query: InvSupplierLookUpQuery = {
      SupplierID: this.filterBySupplierID,
      SupplierName: this.filterBySupplierName,
      PageNumber: pageNumber,
      PageSize: this.gridConfig?.pageSize ?? 10,
      SortField: this.gridConfig?.sortField ?? '',
      SortOrder: this.gridConfig?.sortOrder ?? -1,
    };
    this.dynamicGridService.setLoading(true);
    this.searchSupplier(query);
  }

  selectSupplier(supplier: any): void {
    this.dialogRef.close(supplier);
    // this.router.navigate(['inv-routing-flow-management/edit-routing-flow', id]);
  }

  /**Load data from api call */

  loadData(pageNumber: number) {
    const query: InvSupplierLookUpQuery = {
      SupplierID: this.filterBySupplierID,
      SupplierName: this.filterBySupplierName,
      PageNumber: pageNumber,
      PageSize: this.gridConfig?.pageSize ?? 10,
      SortField: this.gridConfig?.sortField ?? '',
      SortOrder: this.gridConfig?.sortOrder ?? -1,
    };

    this.dynamicGridService.setLoading(true);
    this.searchSupplier(query);
  }

  searchSupplier(searchQuery: InvSupplierLookUpQuery) {
    this.lookOptionService
      .invSearchSupplierLookUp(searchQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.dynamicGridService.updateData(
              res.responseData?.data ?? [],
              res.responseData?.totalCount ?? 0,
              searchQuery.PageSize
            );

            this.totalRecords = res.responseData?.totalCount ?? 0;
          }
        },
        error: () => {
          this.dynamicGridService.setLoading(false);
        },
      });
  }

  search() {
    this.isShowSearchSupplier = true;
    this.loadData(1);
  }
  clear() {
    this.isShowSearchSupplier = false;
    this.filterBySupplierID = '';
    this.filterBySupplierName = '';
  }
}
