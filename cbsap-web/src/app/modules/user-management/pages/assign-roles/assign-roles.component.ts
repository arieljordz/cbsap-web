import { Role } from './../../../../core/model/user-management/role.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, filter, takeUntil } from 'rxjs';
import { TableColumn } from 'src/app/core/model/common/grid-column';
import { ResultObject, ResponseResult } from 'src/app/core/model/common/index';

import { RoleService, GridService } from 'src/app/core/services/index';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { PrimeTemplate } from 'primeng/api';
import { NgFor, NgClass } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { Divider } from 'primeng/divider';

@Component({
    selector: 'app-assign-roles',
    templateUrl: './assign-roles.component.html',
    styleUrls: ['./assign-roles.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        InputText,
        ButtonDirective,
        TableModule,
        PrimeTemplate,
        NgFor,
        NgClass,
        Tooltip,
        Divider,
    ],
})
export class AssignRolesComponent implements OnInit, OnDestroy {
  roles: any ;
  selectedRoles: Role[] = [];
  columns: TableColumn[] = [];
  filterByRoleName: string= '';
  @ViewChild('dtRoles') table: Table | undefined;
  private destroySubject: Subject<void> = new Subject();


  constructor(
    private dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private roleService: RoleService,
    private gridService : GridService
  ) {}

  ngOnInit() {
    this.columns = this.gridService.assignRoleColGrid(); 
    this.getRoles();
    this.selectedRoles = this.config.data.userRoles;
  }

  getRoles() : void {
    this.roleService
      .getRoles()
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Role[]>) => {
          if (result.isSuccess) {
            this.roles = result.responseData?.map(item => ({
              roleID: item.roleID,
              roleName: item.roleName
            }));
          }
        },
        error: (error) => this.onError(error),
      });
  }

  searchRole(): void {
    this.table?.filter(this.filterByRoleName, 'roleName', 'contains');
  }

  onError(error: any) {
    //handle error
  }

  ngOnDestroy() {
    this.destroySubject.next();
  }

  assignRoles() {
    this.dialogRef.close(this.selectedRoles);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
