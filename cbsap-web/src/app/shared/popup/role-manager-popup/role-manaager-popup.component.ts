import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ResponseResult, TableColumn } from 'src/app/core/model/common';
import {
  GetRoleManagerQuery,
  RoleManagerDTO,
} from 'src/app/core/model/roles-management';
import { GridService, RoleService } from 'src/app/core/services';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { NgIf, NgFor, NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-role-manaager-popup',
    templateUrl: './role-manaager-popup.component.html',
    styleUrls: ['./role-manaager-popup.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        InputText,
        Button,
        NgIf,
        TableModule,
        PrimeTemplate,
        NgFor,
        Tooltip,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
    ],
})
export class RoleManagerPopupComponent implements OnInit, OnDestroy {
  private destroySubject: Subject<void> = new Subject();
  roleManagerOptions: RoleManagerDTO[] = [];

  selectedRoleManager!: RoleManagerDTO;
  columns: TableColumn[] = [];
  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;

  filterByName: string | null = null;

  filterByUserID: string | null =null;
  displayedRoleManagers: any[] = [];
  isShowSearchRole: boolean = false;
  constructor(
    private dialogRef: DynamicDialogRef,
    private roleService: RoleService,
    private gridService: GridService
  ) {}

  ngOnInit(): void {
    this.columns = this.gridService.assignRoleManager();
  
  }
  ngOnDestroy(): void {}

  // buttons
  searchRoleManager() {
    this.isShowSearchRole = true;
    let searchQuery: GetRoleManagerQuery = {
      Name: this.filterByName,
      UserID: this.filterByUserID,
    };
    if(!this.filterByName)
      delete searchQuery.Name
    if(!this.filterByUserID)
      delete searchQuery.UserID
    this.getRoleManager(searchQuery);
  }

  //api service
  getRoleManager(searchQuery: GetRoleManagerQuery) {
    this.roleService
      .getRoleManager(searchQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (results: ResponseResult<RoleManagerDTO[]>) => {
          if (results.isSuccess) {
            if (results.responseData) {
              this.roleManagerOptions = results.responseData;
             
            }
          }
        },
        error: (error) => this.onError(error),
      });
  }

  // initialize form

  selectRoleManager(role: RoleManagerDTO) {

    this.dialogRef.close(role); 
  }


  onError(error: any) {}
  trackByFn(index: number, item: any): any {
    return item.field;
  }

  getColumnWidth(field: string): number {
    switch(field) {
        case 'users':
            return 150; 
        case 'roleName':
            return 50; 
        default:
            return 100; 
    }
}
}
