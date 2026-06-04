import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import {
  UserManagementService,
  GridService,
  ExcelService,
  AlertService,
} from 'src/app/core/services/index';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/core/model/user-management/user.model';
import { ConfirmationService, SelectItem, PrimeTemplate } from 'primeng/api';
import { TableColumn } from 'src/app/core/model/common/grid-column';
import { Table, TableModule } from 'primeng/table';

import {
  MessageSeverity,
  getStatusFilterOptions,
} from './../../../../core/constants/index';
import {
  SearchUserModel,
  SearchUserQuery,
} from 'src/app/core/model/user-management/search-user-query';
import { Pagination } from 'src/app/core/model/common/pagination';
import {
  DeleteUserCommand,
  UserSearchPaginationDTO,
} from 'src/app/core/model/user-management';
import { ResponseResult } from 'src/app/core/model/common';

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import {
  NgIf,
  NgFor,
  NgClass,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  DatePipe,
} from '@angular/common';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Tooltip } from 'primeng/tooltip';
import { Avatar } from 'primeng/avatar';
import { Chip } from 'primeng/chip';
import { YesnoPipe } from '../../../../shared/pipes/yesno.pipe';
import { TagModule } from 'primeng/tag';
import { ExportUsersDTO } from '@core/model/user-management/dtos/ExportUsersDTO';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import {
  CustomButton,
  SearchField,
} from '@core/model/quick-search/QuickSearchModel';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [DialogService, AlertService, ConfirmationService],
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    Button,
    NgIf,
    Toast,
    ConfirmDialog,
    TableModule,
    PrimeTemplate,
    NgFor,
    NgClass,
    Tooltip,
    NgSwitch,
    NgSwitchCase,
    Avatar,
    Chip,
    NgSwitchDefault,
    YesnoPipe,
    TagModule,
    QuickSearchComponent,
  ],
})
export class SearchComponent implements OnInit, OnDestroy {
  // rx variables
  private destroySubject: Subject<void> = new Subject();
  users: User[] = [];
  userspagination: UserSearchPaginationDTO[] = [];
  columns: TableColumn[] = [];
  sizes: any;
  selectedSize: any = '';
  statusFilterOptions: SelectItem[] = [];
  triggeredBySearch: boolean = false;
  //paging initial values
  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;
  isNewUserAddWhenSearch: boolean = true;
  btnEditUser: string = 'btnEditUser';

  sortField?: string;
  sortOrder: number = 1;

  userSearchFields: SearchField<SearchUserModel>[] = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'username',
      label: 'Username',
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

  searchUserModel: SearchUserModel = {
    name: '',
    username: '',
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

  @ViewChild('dtUsers') table: Table | undefined;

  constructor(
    private userService: UserManagementService,
    private gridService: GridService,
    private excelService: ExcelService,
    private confirmationService: ConfirmationService,
    private message: AlertService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnDestroy(): void {
    this.destroySubject.next();
  }

  ngOnInit(): void {
    this.statusFilterOptions = getStatusFilterOptions();
    this.columns = this.gridService.userSearchManagementColGrid();
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
  }

  onAdvancedSearch() {}

  newUser() {
    this.router.navigate(['user-management/add-user']);
  }

  editUser(user: User) {
    this.router.navigate(['user-management/edit-user', user.userAccountID]);
  }

  private refreshPopulateUserGrid() {
    setTimeout(() => {
      this.onLazyLoad({ first: 0, rows: 10 });
    }, 3000);
  }

  softUserDeletion(user: User) {
    const deleteUserCommand: DeleteUserCommand = {
      userAccountID: user.userAccountID,
    };

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete user : ' + user.userID + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService
          .deleteUser(deleteUserCommand.userAccountID)
          .subscribe((response) => {
            if (response.isSuccess) {
              this.message.showToast(
                MessageSeverity.success,
                'User Deletion',
                'User successfully deleted'
              );
              this.refreshPopulateUserGrid();
            }
          });
      },
    });
  }

  search(filters: SearchUserModel): void {
    this.searchUserModel = filters;
    this.triggeredBySearch = true;
    this.searchUser();
  }

  onError(error: any) {
    //handle error
  }

  clear(): void {
    this.searchUserModel = {
      name: '',
      username: '',
      isActive: null,
    };
    this.triggeredBySearch = true;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.table?.reset();
    this.searchUser();
  }

  // Export to excel
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

    let exportUserQuery: ExportUsersDTO = {
      UserId: this.searchUserModel.username,
      FullName: this.searchUserModel.name,
    };

    if (
      exportUserQuery.UserId == null ||
      exportUserQuery.UserId === undefined
    ) {
      exportUserQuery.UserId = '';
    }

    if (
      exportUserQuery.FullName == null ||
      exportUserQuery.FullName === undefined
    ) {
      exportUserQuery.FullName = '';
    }

    if (
      this.searchUserModel.isActive !== null &&
      this.searchUserModel.isActive !== undefined
    ) {
      exportUserQuery.IsActive = this.searchUserModel.isActive;
    }

    this.userService
      .exportUsers(exportUserQuery)
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
    return `Users_${timestamp}.xlsx`;
  }

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
    this.searchUser();
  }
  searchUser() {
    let searchQuery: SearchUserQuery = {
      FullName: this.searchUserModel.name || '',
      UserId: this.searchUserModel.username || '',
      IsActive: this.searchUserModel.isActive,
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      SortField: this.sortField,
      SortOrder: this.sortOrder,
    };

    if (this.sortField == null) {
      delete searchQuery.SortField;
    }

    if (
      this.searchUserModel.isActive === null ||
      this.searchUserModel.isActive == undefined
    ) {
      delete searchQuery.IsActive;
    }

    this.userService
      .searchUser(searchQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Pagination<UserSearchPaginationDTO>>) => {
          if (result.isSuccess) {
            if (result.responseData?.data) {
              this.userspagination = result.responseData?.data;
              this.totalRecords = result.responseData?.totalCount;
            }
            this.loading = false;
            this.triggeredBySearch = false;
          }
        },
        error: (error) => this.onError(error),
      });
  }
  onPageChange(event: any) {
    this.pageNumber = event.first + 1; //page starts from 0, so incrementing by 1
    this.pageSize = event.rows;
    this.searchUser(); // Call search again when page changes
  }
}
