import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ResponseResult } from 'src/app/core/model/common';
import {
  RoleManagerDTO,
  GetActiveRolesQuery,
} from 'src/app/core/model/roles-management/index';
import { Role } from 'src/app/core/model/user-management/role.model';
import { RoleService } from 'src/app/core/services';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { Listbox } from 'primeng/listbox';
import { PrimeTemplate } from 'primeng/api';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';

@Component({
    selector: 'app-search-role',
    templateUrl: './search-role.component.html',
    styleUrls: ['./search-role.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        InputText,
        Listbox,
        PrimeImportsModule
    ],
})
export class SearchRoleComponent implements OnInit, OnDestroy {
  private destroySubject: Subject<void> = new Subject();

  activeRolesOptions: RoleManagerDTO[] = [];
  selectedRoles: RoleManagerDTO[] = [];
  roles: RoleManagerDTO[] = [];

  filterbyRoleName?: string | null;
  filterbyFirstName?: string | null;
  filterbyLastName?: string | null;

  constructor(
    private roleService: RoleService,
    private dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.roles = this.config.data.userRoles;
    this.search();
  }

  // actions
  search() {
    let searchQuery: GetActiveRolesQuery = {
      RoleName: this.filterbyRoleName,
      FirstName: this.filterbyFirstName,
      LastName: this.filterbyLastName,
    };
    if (!this.filterbyRoleName) delete searchQuery.RoleName;
    if (!this.filterbyFirstName) delete searchQuery.FirstName;
    if (!this.filterbyLastName) delete searchQuery.LastName;

    this.searchRoles(searchQuery);
  }

  searchRoles(query: GetActiveRolesQuery) {
    this.roleService
      .searchActiveRoles(query)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (results: ResponseResult<RoleManagerDTO[]>) => {
          if (results.isSuccess) {
            if (results.responseData) {
              this.activeRolesOptions = results.responseData;
              const newSelectedRoles = this.activeRolesOptions.filter((item) =>
                this.roles.some((s: any) => s.roleID == item.roleID)
              );

              this.selectedRoles = [
                ...new Set([...this.selectedRoles, ...newSelectedRoles]),
              ];
            }
          }
        },
      });
  }
  closedSearchRoleDialog() {
    this.dialogRef.close(this.selectedRoles);
  }

  get selectedRowLabel(): string {
    return `Assign role(s) : ${this.selectedRoles.length || 0}`;
  }
}
