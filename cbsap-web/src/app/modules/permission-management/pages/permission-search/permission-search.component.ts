import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import {
  getStatusFilterOptions,
  MessageSeverity,
} from 'src/app/core/constants';
import { ResponseResult } from 'src/app/core/model/common';
import { TableColumn } from 'src/app/core/model/common/grid-column';
import { Pagination } from 'src/app/core/model/common/pagination';
import { PermissionSearchDTO } from 'src/app/core/model/permission-management';
import {
  AlertService,
  ExcelService,
  GridService,
  PermissionService,
} from 'src/app/core/services/index';
import {
  ExportPermissionQuery,
  PermissionSearchModel,
  SearchPermissionParamQuery,
} from '../../../../core/model/permission-management/index';

import {
  DatePipe,
  NgClass,
  NgFor,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CustomButton,
  SearchField,
} from '@core/model/quick-search/QuickSearchModel';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import { PrimeImportsModule } from 'src/app/shared/moduleResources/prime-imports';
import { YesnoPipe } from '../../../../shared/pipes/yesno.pipe';

@Component({
  selector: 'app-permission-search',
  templateUrl: './permission-search.component.html',
  styleUrls: ['./permission-search.component.scss'],
  providers: [DialogService, AlertService, ConfirmationService, DatePipe],
  standalone: true,
  imports: [
    FormsModule,
    PrimeTemplate,
    NgFor,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    YesnoPipe,
    PrimeImportsModule,
    QuickSearchComponent,
  ],
})
export class PermissionSearchComponent implements OnInit, OnDestroy {
  @ViewChild('dtPermission') table: Table | undefined;
  private destroySubject: Subject<void> = new Subject();

  sizes: any;

  //pagination
  permissionpagination: PermissionSearchDTO[] = []; //  change to permission objecy
  columns: TableColumn[] = [];
  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;

  visible: boolean = false;
  sortField?: string;
  sortOrder: number = 1;
  triggeredBySearch: boolean = false;

  permissionSearchFields: SearchField<PermissionSearchModel>[] = [
    {
      key: 'permissionID',
      label: 'Permission Group ID',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'permissionName',
      label: 'Permission Group Name',
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

  searchPermissionModel: PermissionSearchModel = {
    permissionID: null,
    permissionName: '',
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

  constructor(
    private gridService: GridService,
    private permissionService: PermissionService,
    private excelService: ExcelService,
    private message: AlertService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnDestroy(): void {
    this.destroySubject.next();
  }

  ngOnInit(): void {
    const stored = localStorage.getItem('permission-search');
    if(stored){
      this.searchPermissionModel = JSON.parse(stored);
    }
    this.columns = this.gridService.permissionManagementColumn();
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
  }

  onAdvancedSearch() {}

  showDialog() {
    this.visible = true;
  }

  clear() {
    localStorage.removeItem('permission-search');
    localStorage.removeItem('permission-grid');
    this.searchPermissionModel = {
      permissionID: null,
      permissionName: '',
      isActive: null,
    };
    this.triggeredBySearch = true;
    this.totalRecords = 0;
    this.pageNumber = 0;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.table?.reset();
    this.searchPermission();
  }

  /**Button Event */
  createPermission() {
    this.router.navigate(['permission-management/new-permission']);
  }

  /**Methods */
  onLazyLoad(event: any): void {
    if (this.triggeredBySearch) {
      // skip this call since search() already did it
      // avoids double request when search button is clicked
      this.triggeredBySearch = false;
      return;
    }

    this.sortField = event.sortField ? event.sortField : null;
    this.sortOrder = event.sortOrder ? event.sortOrder : 1;
    this.loading = true;
    this.pageNumber = event.first / event.rows + 1; // Calculate page number for the API request
    this.pageSize = event.rows; // Update page size
    this.searchPermission();
  }

  onPageChange(event: any) {
    this.pageNumber = event.first + 1; //page starts from 0, so incrementing by 1
    this.pageSize = event.rows;
    this.searchPermission();
  }
  //grid methods
  searchPermission(): void {
    let searchPermissionParamQuery: SearchPermissionParamQuery = {
      PermissionID: this.searchPermissionModel.permissionID,
      PermissionName: this.searchPermissionModel.permissionName || '',
      IsActive: this.searchPermissionModel.isActive,
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      SortField: this.sortField,
      SortOrder: this.sortOrder,
    };

    if (this.sortField == null) {
      delete searchPermissionParamQuery.SortField;
    }

    if (this.searchPermissionModel.permissionID == null) {
      delete searchPermissionParamQuery.PermissionID;
    }
    if (
      this.searchPermissionModel.isActive === null ||
      this.searchPermissionModel.isActive === undefined
    ) {
      delete searchPermissionParamQuery.IsActive;
    }

    this.permissionService
      .searchPermission(searchPermissionParamQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Pagination<PermissionSearchDTO>>) => {
          if (result.isSuccess) {
            if (result.responseData?.data) {
              this.permissionpagination = result.responseData?.data;

              this.totalRecords = result.responseData?.totalCount;
            }
            this.loading = false;
            this.triggeredBySearch = false;
          }
        },
        error: (error) => this.onError(error),
      });
  }

  editPermission(permission: any): void {
    const id = permission.permissionID;
    localStorage.setItem('permission-search',JSON.stringify(this.searchPermissionModel));
    this.router.navigate(['permission-management/edit-permission', id]);
  }

  search(filters: PermissionSearchModel): void {
    this.searchPermissionModel = filters;
    this.triggeredBySearch = true;
    this.searchPermission();
  }

  // Export to excel
  exportExcel() {
    if (this.totalRecords === 0) {
      this.message.showToast(
        MessageSeverity.warn,
        'Warning ',
        'Please hit search button before exporting data'
      );
      return;
    }

    let searchPermissionParamQuery: ExportPermissionQuery = {
      PermissionID: this.searchPermissionModel.permissionID,
      PermissionName: this.searchPermissionModel.permissionName || '',
      IsActive: this.searchPermissionModel.isActive,
    };

    if (
      this.searchPermissionModel.permissionID === null ||
      this.searchPermissionModel.permissionID === undefined
    ) {
      delete searchPermissionParamQuery.PermissionID;
    }
    if (
      this.searchPermissionModel.isActive === null ||
      this.searchPermissionModel.isActive === undefined
    ) {
      delete searchPermissionParamQuery.IsActive;
    }

    this.permissionService
      .exportPermission(searchPermissionParamQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Blob>) => {
          if (result.isSuccess) {
            if (result.responseData) {
              const blob = result.responseData;
              this.excelService.saveFile(blob, this.getTimestampedFileName());
            } else {
            }
            this.loading = false;
          }
        },
        error: (error) => this.onError(error),
      });
  }

  private refreshPopulatePermissionGrid() {
    setTimeout(() => {
      this.onLazyLoad({ first: 0, rows: 10 });
    }, 3000);
  }

  onError(error: any) {
    //handle error
  }

  getTimestampedFileName(): string {
    const timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    return `Permission_${timestamp}.xlsx`;
  }
}
