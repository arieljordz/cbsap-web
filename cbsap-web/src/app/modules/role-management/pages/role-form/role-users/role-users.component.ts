import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Pagination, ResponseResult } from '@core/model/common';
import { RoleUserDto } from '@core/model/roles-management';
import { UserSearchPaginationDTO } from '@core/model/user-management';
import { SearchUserQuery } from '@core/model/user-management/search-user-query';
import {
  GridService,
  UserManagementService
} from '@core/services';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { SelectTableComponent } from '@shared/popup/select-table/select-table.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-role-users',
  standalone: true,
  providers: [DialogService],
  imports: [ReactiveFormsModule, FormsModule, PrimeImportsModule],
  templateUrl: './role-users.component.html',
  styleUrl: './role-users.component.scss',
})
export class RoleUsersComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  @Input() formSubmitted!: Boolean;

  private selectModelName = 'selectedUsers';
  private destroySubject: Subject<void> = new Subject();
  private dataList$ = new BehaviorSubject<any[]>([]);
  private totalRecord$ = new BehaviorSubject<number>(0);
  totalRecords = 0;
  usersPagination: RoleUserDto[] = [];

  constructor(
    private dialogService: DialogService,
    private userService: UserManagementService,
    private gridService: GridService
  ) {}

  ngOnInit(): void {}

  assignUsers(): void {
    const ref: DynamicDialogRef = this.dialogService.open(
      SelectTableComponent,
      {
        header: 'Select Users',
        contentStyle: { 'max-height': '500px', overflow: 'auto' },
        baseZIndex: 10000,
        modal: true,
        closable: true,
        data: {
          multiple: true,
          columns: this.gridService.userSelectGridColumn(),
          data$: this.dataList$,
          totalRecords$: this.totalRecord$,
          selectedRows: this.f?.[this.selectModelName]?.value || [],
          onSearch: (filters: any) => {
            const query: SearchUserQuery = {
              ...filters,
              IsActive: true,
            };
            this.searchUsers(query);
          },
        },
      }
    );

    ref.onClose.subscribe((selected) => {
      if (selected) {
        this.formGroup.patchValue({
          selectedUsers: selected,
        });
      }
    });
  }

  searchUsers(query: SearchUserQuery) {
    this.userService
      .searchUser(query)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Pagination<UserSearchPaginationDTO>>) => {
          if (result.isSuccess && result.responseData?.data) {
            this.usersPagination = result.responseData.data;
            this.usersPagination = result.responseData.data.map(
              (user: UserSearchPaginationDTO): RoleUserDto => ({
                userAccountID: user.userAccountID,
                fullName: user.fullName,
                userID: user.userID
              })
            );
            this.totalRecords = result.responseData.totalCount;

            // Push new data to the modal table
            this.dataList$.next(this.usersPagination);
            this.totalRecord$.next(this.totalRecords);
          }
        },
        error: (error) => this.onError(error),
      });
  }

  onError(error: any) {
    this.dataList$.next([]);
  }

  onRowDelete(userToDelete: any): void {
    const currentUsers = this.f[this.selectModelName]?.value || [];

    const updatedUsers = currentUsers.filter(
      (user: any) => user !== userToDelete
    );

    this.f[this.selectModelName].setValue(updatedUsers);
  }

  get f() {
    return this.formGroup.controls;
  }

  get selectedUsers(): any[] {
    return this.f[this.selectModelName]?.value || [];
  }

  trackByFn(index: number, item: any): any {
    return item.field;
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
