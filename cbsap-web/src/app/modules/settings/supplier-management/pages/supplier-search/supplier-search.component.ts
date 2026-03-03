import {
  DatePipe,
  NgClass,
  NgFor,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault
} from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getStatusFilterOptions, MessageSeverity } from '@core/constants';
import { Pagination, ResponseResult } from '@core/model/common';
import { TableColumn } from '@core/model/common/grid-column';
import {
  CustomButton,
  SearchField,
} from '@core/model/quick-search/QuickSearchModel';
import { SearchSupplierQuery } from '@core/model/system-settings/supplier/search-supplier.query';
import {
  SupplierExportQuery,
  SupplierSearchDto,
  SupplierSearchModel,
} from '@core/model/system-settings/supplier/supplier.index';
import {
  AlertService,
  ExcelService,
  GridService,
  SupplierInfoService,
} from '@core/services';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { YesnoPipe } from '@shared/pipes/yesno.pipe';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-supplier-search',
  standalone: true,
  providers: [AlertService, DatePipe],
  imports: [
    FormsModule,
    PrimeImportsModule,
    NgClass,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    YesnoPipe,
    QuickSearchComponent
  ],
  templateUrl: './supplier-search.component.html',
  styleUrl: './supplier-search.component.scss',
})
export class SupplierSearchComponent implements OnInit, OnDestroy {
  @ViewChild('dtSearchSupplierPagination') table: Table | undefined;
  private destroySubject: Subject<void> = new Subject();

  supplierPagination: SupplierSearchDto[] = [];
  columns: TableColumn[] = [];
  sizes: any;
  triggeredBySearch: boolean = false;
  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  sortField?: string = '';
  sortOrder: number = 1;

  supplierSearchFields: SearchField<SupplierSearchModel>[] = [
    {
      key: 'entityName',
      label: 'Entity',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'supplierID',
      label: 'Supplier ID',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'supplierName',
      label: 'Supplier Name',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'isActive',
      label: 'Active Status',
      type: 'text',
      fieldType: 'dropdown',
      options: getStatusFilterOptions(),
    },
  ];

  searchSupplierModel: SupplierSearchModel = {
    entityName: '',
    supplierID: '',
    supplierName: '',
    isActive: null,
  };

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

  /**
   *
   */
  constructor(
    private router: Router,
    private gridService: GridService,
    private supplierService: SupplierInfoService,
    private message: AlertService,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ) {}

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
  ngOnInit(): void {
    this.columns = this.gridService.supplierGridColumn();
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
  }

  onAdvancedSearch() {}

  addSupplier() {
    this.router.navigate(['supplier-management/add-supplier']);
  }

  search(filters: SupplierSearchModel) {
    this.searchSupplierModel = filters;
    this.triggeredBySearch = true;
    this.searchSupplier();
  }

  clear() {
    this.searchSupplierModel = {
      entityName: '',
      supplierID: '',
      supplierName: '',
      isActive: null,
    };
    this.triggeredBySearch = true;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.table?.reset();
    this.searchSupplier();
  }

  editSupplier(supplier: any): void {
    const id = supplier.supplierInfoID;
    this.router.navigate(['supplier-management/edit-supplier', id]);
  }
  searchSupplier() {
    let searchEntityQuery: SearchSupplierQuery = {
      EntityName: this.searchSupplierModel.entityName || '',
      SupplierID: this.searchSupplierModel.supplierID || '',
      SupplierName: this.searchSupplierModel.supplierName || '',
      IsActive: this.searchSupplierModel.isActive,
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      SortField: this.sortField,
      SortOrder: this.sortOrder,
    };

    if (
      this.searchSupplierModel.isActive === null ||
      this.searchSupplierModel.isActive === undefined
    ) {
      delete searchEntityQuery.IsActive;
    }

    this.supplierService
      .searchSupplier(searchEntityQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Pagination<SupplierSearchDto>>) => {
          if (result.isSuccess) {
            if (result.responseData?.data) {
              this.supplierPagination = result.responseData?.data;
              this.totalRecords = result.responseData?.totalCount;
            }
            this.loading = false;
            this.triggeredBySearch = false;
          }
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
    let exportEntityQuery: SupplierExportQuery = {
      EntityName: this.searchSupplierModel.entityName || '',
      SupplierID: this.searchSupplierModel.supplierID || '',
      SupplierName: this.searchSupplierModel.supplierName || '',
      IsActive: this.searchSupplierModel.isActive,
    };

    if (
      this.searchSupplierModel.isActive === null ||
      this.searchSupplierModel.isActive === undefined
    ) {
      delete exportEntityQuery.IsActive;
    }
    this.supplierService
      .exportSupplier(exportEntityQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Blob>) => {
          if (result.isSuccess) {
            if (result.responseData) {
              const blob = result.responseData;
              this.excelService.saveFile(
                blob,
                this.excelService.excelFileName('Supplier')
              );
            } else {
            }
            this.loading = false;
          }
        },
        error: (error) => this.onError(error),
      });
  }

  onPageChange(event: any) {
    this.pageNumber = event.first + 1; //page starts from 0, so incrementing by 1
    this.pageSize = event.rows;
    this.searchSupplier();
  }
  onLazyLoad(event: any): void {
    if (this.triggeredBySearch) {
      // skip this call since search() already did it
      // avoids double request when search button is clicked
      this.triggeredBySearch = false;
      return;
    }

    this.sortField = event.sortField ? event.sortField : '';
    this.sortOrder = event.sortOrder ? event.sortOrder : 1;
    this.loading = true;
    this.pageNumber = event.first / event.rows + 1; // Calculate page number for the API request
    this.pageSize = event.rows; // Update page size
    this.searchSupplier();
  }
  onError(error: any) {}
}
