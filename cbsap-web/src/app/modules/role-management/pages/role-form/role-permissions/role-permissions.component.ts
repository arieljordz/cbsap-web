import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Pagination, ResponseResult } from '@core/model/common';
import {
  PermissionSearchDTO,
  SearchPermissionParamQuery,
} from '@core/model/permission-management';
import { RolePermissionDto } from '@core/model/roles-management';
import { GridService, PermissionService } from '@core/services';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { SelectTableComponent } from '@shared/popup/select-table/select-table.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-role-permissions',
  standalone: true,
  providers: [DialogService],
  imports: [ReactiveFormsModule, FormsModule, PrimeImportsModule],
  templateUrl: './role-permissions.component.html',
  styleUrl: './role-permissions.component.scss',
})
export class RolePermissionsComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  @Input() formSubmitted!: Boolean;

  private selectModelName = 'selectedPermissions';
  private destroySubject: Subject<void> = new Subject();
  private dataList$ = new BehaviorSubject<any[]>([]);
  private totalRecord$ = new BehaviorSubject<number>(0);
  totalRecords = 0;
  permissionPagination: RolePermissionDto[] = [];

  constructor(
    private dialogService: DialogService,
    private permissionService: PermissionService,
    private gridService: GridService
  ) {}

  ngOnInit(): void {}

  assignPermissions(): void {
    const ref: DynamicDialogRef = this.dialogService.open(
      SelectTableComponent,
      {
        header: 'Select Permission',
        contentStyle: { 'max-height': '500px', overflow: 'auto' },
        baseZIndex: 10000,
        modal: true,
        closable: true,
        data: {
          multiple: true,
          columns: this.gridService.permissionSelectGridColumn(),
          data$: this.dataList$,
          totalRecords$: this.totalRecord$,
          selectedRows: this.f?.[this.selectModelName]?.value || [],
          onSearch: (filters: any) => {
            const query: SearchPermissionParamQuery = {
              ...filters,
              IsActive: true,
            };
            this.searchPermissions(query);
          },
        },
      }
    );

    ref.onClose.subscribe((selected) => {
      if (selected) {
        this.formGroup.patchValue({
          selectedPermissions: selected,
        });
      }
    });
  }

  searchPermissions(query: SearchPermissionParamQuery) {
    this.permissionService
      .searchPermission(query)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Pagination<PermissionSearchDTO>>) => {
          if (result.isSuccess && result.responseData?.data) {
            this.permissionPagination = result.responseData.data.map(
              (perm: PermissionSearchDTO): RolePermissionDto => ({
                permissionID: perm.permissionID,
                permissionName: perm.permissionName
              })
            );
            this.totalRecords = result.responseData.totalCount;

            // Push new data to the modal table
            this.dataList$.next(this.permissionPagination);
            this.totalRecord$.next(this.totalRecords);
          }
        },
        error: (error) => this.onError(error),
      });
  }

  onError(error: any) {
    this.dataList$.next([]);
  }

  onRowDelete(permissionToDelete: any): void {
    const currentPermissions = this.f[this.selectModelName]?.value || [];

    const updatedPermissions = currentPermissions.filter(
      (permission: any) => permission !== permissionToDelete
    );

    this.f[this.selectModelName].setValue(updatedPermissions);
  }

  get f() {
    return this.formGroup.controls;
  }

  get selectedPermissions(): any[] {
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
