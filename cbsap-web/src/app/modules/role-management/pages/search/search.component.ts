import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  getStatusFilterOptions,
  MessageSeverity,
} from 'src/app/core/constants';
import { TableColumn } from 'src/app/core/model/common/grid-column';
import { ResponseResult } from 'src/app/core/model/common/index';

import { Table } from 'primeng/table';
import {
  RolePermissionDto,
  RoleSearchDTO,
  RoleSearchModel,
  SearchRolePaginationParamQuery,
} from 'src/app/core/model/roles-management/index';

import {
  DatePipe,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchField } from '@core/model/quick-search/QuickSearchModel';
import { ExportRolesQuery } from '@core/model/roles-management/dtos/ExportRolesQuery';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import {
  QuickSearchComponent
} from '@shared/quick-search/quick-search.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Pagination } from 'src/app/core/model/common';
import { PermissionDetailDTO } from 'src/app/core/model/permission-management';
import {
  AlertService,
  ExcelService,
  GridService,
  RoleService,
} from 'src/app/core/services/index';
import { YesnoPipe } from '../../../../shared/pipes/yesno.pipe';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [DialogService, AlertService, ConfirmationService],
  standalone: true,
  imports: [
    FormsModule,
    PrimeImportsModule,
    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    OverlayPanelModule,
    NgSwitchDefault,
    YesnoPipe,
    QuickSearchComponent,
  ],
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('dtRoles') table: Table | undefined;
  private destroySubject: Subject<void> = new Subject();

  //pagination
  rolespagination: RoleSearchDTO[] = [];
  columns: TableColumn[] = [];

  permissionGroupColumns: TableColumn[] = [];

  rolePermission: PermissionDetailDTO[] = [];
  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortOrder: number = 1;
  loading: boolean = true;
  visible: boolean = false;
  showMore = false;
  triggeredBySearch: boolean = false;

  isExcelPermissionGroup: boolean = false;

  maxLength = 50; // Adjust as needed

  roleSearchFields: SearchField<RoleSearchModel>[] = [
    {
      key: 'entityName',
      label: 'Entity',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'roleName',
      label: 'Role Name',
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

  searchRoleModel: RoleSearchModel = {
    entityName: '',
    roleName: '',
    isActive: null,
  };

  searchActionButtonsConfig = {
    search: true,
    clear: true,
    export: true,
  };

  constructor(
    private roleService: RoleService,
    private gridService: GridService,
    private excelService: ExcelService,
    private message: AlertService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.columns = this.gridService.roleManagementSearchColGrid();
    this.permissionGroupColumns = this.gridService.rolePermissionGroupGrid();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
  }

  /*  Button Events */
  search(filters: RoleSearchModel) {
    this.searchRoleModel = filters;
    this.triggeredBySearch = true;
    this.searchRoles();
  }

  newRole() {
    this.router.navigate(['role-management/add-role']);
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  clear() {
    this.searchRoleModel = {
      entityName: '',
      roleName: '',
      isActive: null,
    };
    this.triggeredBySearch = true;
    this.totalRecords = 0;
    this.pageNumber = 0;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.table?.reset();
    this.searchRoles();
  }

  /** Events */
  searchRoles(): void {
    let searchRolePaginationParamQuery: SearchRolePaginationParamQuery = {
      Entity: this.searchRoleModel.entityName,
      RoleName: this.searchRoleModel.roleName,
      IsActive: this.searchRoleModel.isActive,
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      SortField: this.sortField,
      SortOrder: this.sortOrder,
    };

    if (this.searchRoleModel.entityName == null) {
      delete searchRolePaginationParamQuery.Entity;
    }

    if (this.searchRoleModel.roleName == null) {
      delete searchRolePaginationParamQuery.RoleName;
    }

    if (this.searchRoleModel.isActive == null) {
      delete searchRolePaginationParamQuery.IsActive;
    }

    this.roleService
      .searchRoles(searchRolePaginationParamQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Pagination<RoleSearchDTO>>) => {
          if (result.isSuccess) {
            if (result.responseData?.data) {
              this.rolespagination = result.responseData?.data;
              this.totalRecords = result.responseData?.totalCount;
            }
            this.loading = false;
            this.triggeredBySearch = false;
          }
        },
        error: (error) => this.onError(error),
      });
  }

  getpermissionByRole(roleID: number) {
    this.roleService
      .getRolePermissionsByRoleId(roleID)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<RolePermissionDto[]>) => {
          if (result.isSuccess) {
            if (result.responseData) {
              this.rolePermission = result.responseData;
            }
            this.loading = false;
          }
        },
        error: (error) => this.onError(error),
      });
  }

  onLazyLoad(event: any): void {
    if (this.triggeredBySearch) {
      // skip this call since search() already did it
      // avoids double request when search button is clicked
      this.triggeredBySearch = false;
      return;
    }

    this.loading = true;
    this.pageNumber = event.first / event.rows + 1; // Calculate page number for the API request
    this.pageSize = event.rows; // Update page size
    this.sortField = event.sortField ? event.sortField : '';
    this.sortOrder = event.sortOrder ? event.sortOrder : 1;
    this.searchRoles();
  }
  onPageChange(event: any) {
    this.pageNumber = event.first + 1; //page starts from 0, so incrementing by 1
    this.pageSize = event.rows;
    this.searchRoles(); // Call search again when page changes
  }

  editRole(role: RoleSearchDTO) {
    const id = role.roleID;
    this.router.navigate(['role-management/edit-role', id]);
  }

  exportExcel() {
    if (this.totalRecords === 0) {
      this.message.showToast(
        MessageSeverity.warn,
        'Warning',
        'Please hit search button before exporting data.'
      );
      return;
    }

    this.loading = true;

    let exportRolesQuery: ExportRolesQuery = {
      EntityName: this.searchRoleModel.entityName,
      RoleName: this.searchRoleModel.roleName,
      IsActive: this.searchRoleModel.isActive,
    };

    if (this.searchRoleModel.entityName == null) {
      delete exportRolesQuery.EntityName;
    }
    if (this.searchRoleModel.roleName == null) {
      delete exportRolesQuery.RoleName;
    }
    if (this.searchRoleModel.isActive == null) {
      delete exportRolesQuery.IsActive;
    }

    this.roleService
      .exportRoles(exportRolesQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Blob>) => {
          if (result.isSuccess && result.responseData) {
            const blob = result.responseData;
            this.excelService.saveFile(blob, this.getTimestampedFileName());
          }
        },
        error: (error: ResponseResult<boolean>) => {
          this.message.showToast(
            MessageSeverity.error.toString(),
            'Error on Role export',
            error.messages?.[0],
            2000
          );
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  getTimestampedFileName(): string {
    const timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    return `Roles_${timestamp}.xlsx`;
  }

  onError(error: any) {
    //handle error
  }
  trackByFn(index: number, item: any): any {
    return item.field;
  }
  private refreshPopulateRolesGrid() {
    setTimeout(() => {
      this.onLazyLoad({ first: 0, rows: 10 });
    }, 3000);
  }
}
