import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { ReminderNotificationComponent } from './reminder-notification/reminder-notification.component';
import { RoleEntitiesComponent } from './role-entities/role-entities.component';
import { RolePermissionsComponent } from './role-permissions/role-permissions.component';
import { RoleUsersComponent } from './role-users/role-users.component';
import {
  CreateRoleCommand,
  RoleDto,
  RoleSearchDTO,
  UpdateRoleCommand,
} from '@core/model/roles-management';
import { MessageSeverity } from '@core/constants';
import { AlertService, RoleService } from '@core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResponseResult } from '@core/model/common';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    PrimeImportsModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    BasicInfoComponent,
    ReminderNotificationComponent,
    RoleEntitiesComponent,
    RolePermissionsComponent,
    RoleUsersComponent,
  ],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss',
})
export class RoleFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  roleDetailForm!: FormGroup;
  pageLabel: string;

  roleId: number = 0;

  private readonly ADD_LABEL = 'Add Role';
  private readonly EDIT_LABEL = 'Edit Role';

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private message: AlertService,
    private router: Router,
    private activetRoute: ActivatedRoute
  ) {
    this.initializeForm();
    this.roleId = Number(this.activetRoute.snapshot.params['roleID'] ?? 0);
    this.pageLabel = this.roleId > 0 ? this.EDIT_LABEL : this.ADD_LABEL;
  }

  ngOnInit(): void {
    if (this.roleId > 0) {
      this.loadRole(this.roleId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.roleDetailForm = this.fb.group({
      basicInfo: this.fb.group({
        roleName: ['', Validators.required],
        authorisationLimit: [null],
        roleManager1: [null],
        roleManager1Name: [null],
        roleManager2: [null],
        roleManager2Name: [null],
        isActive: [true],
        selectedRoleId: [null],
        canBeAddedToInvoice: [false],
      }),
      reminderNotification: this.fb.group({
        invoiceDueDateNotification: [null],
        invoiceEscalateToLevel1ManagerNotification: [null],
        forwardToLevel1Manager: [null],
        forwardToLevel2Manager: [null],
        isNewInvoiceReceiveNotification: [false],
      }),
      roleEntities: this.fb.group({
        selectedEntities: [[]],
      }),
      rolePermissions: this.fb.group({
        selectedPermissions: [[]],
      }),
      userRoles: this.fb.group({
        selectedUsers: [[]],
      }),
    });
  }

  private loadRole(id: number): void {
    this.roleService
      .getRolesByID(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results: ResponseResult<RoleDto>) => {
          if (results.isSuccess && results.responseData) {
            this.patchFormValues(results.responseData);
          }
        },
        error: (error) => this.onError(error),
      });
  }

  private patchFormValues(data: RoleDto): void {
    this.roleDetailForm.patchValue({
      basicInfo: {
        roleName: data.roleName,
        authorisationLimit: data.authorisationLimit,
        roleManager1: data.roleManager1,
        roleManager1Name: data.roleManager1Name,
        roleManager2: data.roleManager2,
        roleManager2Name: data.roleManager2Name,
        isActive: data.isActive,
        selectedRoleId: data.roleID,
        canBeAddedToInvoice: data.canBeAddedToInvoice,
      },
      reminderNotification: data.reminderNotification,
      roleEntities: {
        selectedEntities: data.roleEntities || [],
      },
      rolePermissions: {
        selectedPermissions: data.rolePermissions || [],
      },
      userRoles: {
        selectedUsers: data.roleUsers || [],
      },
    });
  }

  private buildCreateRoleCommand(): CreateRoleCommand {
    const formValue = this.roleDetailForm.value;
    return {
      roleName: formValue.basicInfo.roleName,
      isActive: formValue.basicInfo.isActive,
      authorisationLimit: formValue.basicInfo.authorisationLimit,
      roleManager1: formValue.basicInfo.roleManager1,
      roleManager2: formValue.basicInfo.roleManager2,
      canBeAddedToInvoice: formValue.basicInfo.canBeAddedToInvoice,
      roleEntities: formValue.roleEntities.selectedEntities.map(
        (e: any) => e.entityProfileID
      ),
      rolePermissionGroups: formValue.rolePermissions.selectedPermissions.map(
        (p: any) => p.permissionID
      ),
      userRoles: formValue.userRoles.selectedUsers.map(
        (u: any) => u.userAccountID
      ),
      reminderNotification: formValue.reminderNotification,
    };
  }

  private buildUpdateRoleCommand(): UpdateRoleCommand {
    const formValue = this.roleDetailForm.value;

    return {
      roleID: this.roleId,
      roleName: formValue.basicInfo.roleName,
      isActive: formValue.basicInfo.isActive,
      authorisationLimit: formValue.basicInfo.authorisationLimit,
      roleManager1: formValue.basicInfo.roleManager1,
      roleManager2: formValue.basicInfo.roleManager2,
      canBeAddedToInvoice: formValue.basicInfo.canBeAddedToInvoice,
      reminderNotification: formValue.reminderNotification,
      roleEntities: formValue.roleEntities.selectedEntities.map(
        (e: any) => e.entityProfileID
      ),
      rolePermissionGroups: formValue.rolePermissions.selectedPermissions.map(
        (p: any) => p.permissionID
      ),
      userRoles: formValue.userRoles.selectedUsers.map(
        (u: any) => u.userAccountID
      ),
    };
  }

  onSave(): void {
    if (this.roleId > 0) {
      this.onEdit();
    } else {
      const createRoleCommand = this.buildCreateRoleCommand();

      this.roleService.saveRole(createRoleCommand).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.message.showToast(
              MessageSeverity.success.toString(),
              'Role Created',
              'Role has been successfully created.',
              2000
            );
          }
        },
        error: (error: ResponseResult<boolean>) => {
          this.message.showToast(
            MessageSeverity.error.toString(),
            'Error on Role Creation',
            error.messages?.[0],
            2000
          );
        },
        complete: () => {
          this.router.navigate(['role-management']);
        },
      });
    }
  }

  onEdit(): void {
    const updateRoleCommand = this.buildUpdateRoleCommand();

    this.roleService.updateRole(updateRoleCommand).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Role Updated',
            'Role has been successfully updated.'
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on Role update',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.router.navigate(['role-management']);
      },
    });
  }

  onError(error: any) {
    // TODO: Implement error handling logic
    console.error('Error occurred:', error);
  }

  confirmDelete(): void {
    // TODO: Implement deletion logic
  }

  cancel(): void {
    this.router.navigate(['role-management']);
  }

  get basicInfoGroup(): FormGroup {
    return this.roleDetailForm.get('basicInfo') as FormGroup;
  }

  get reminderNotificationGroup(): FormGroup {
    return this.roleDetailForm.get('reminderNotification') as FormGroup;
  }

  get roleEntitiesGroup(): FormGroup {
    return this.roleDetailForm.get('roleEntities') as FormGroup;
  }

  get rolePermissionsGroup(): FormGroup {
    return this.roleDetailForm.get('rolePermissions') as FormGroup;
  }

  get userRolesGroup(): FormGroup {
    return this.roleDetailForm.get('userRoles') as FormGroup;
  }
}
