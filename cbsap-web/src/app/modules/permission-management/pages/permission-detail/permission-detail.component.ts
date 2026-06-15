import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PrimeImportsModule } from 'src/app/shared/moduleResources/prime-imports';

import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {
  AlertService,
  PermissionService,
  ValidationService,
} from 'src/app/core/services/index';

import { Subject, takeUntil } from 'rxjs';
import { MessageSeverity } from 'src/app/core/constants';
import { ResponseResult } from 'src/app/core/model/common/index';
import {
  GroupPanelDTO,
  OperationsDTO,
  PermissionCommand,
  PermissionSearchByIdDTO,
  UpdatePermissionCommand,
} from 'src/app/core/model/permission-management/index';
import { Role } from 'src/app/core/model/user-management/role.model';

import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Chip } from 'primeng/chip';
import { Fieldset } from 'primeng/fieldset';
import { Panel } from 'primeng/panel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { getErrorMessage } from 'src/app/core/utils';
import { SearchRoleComponent } from 'src/app/shared/popup/search-role/search-role.component';
import { CharacterLengthPipe } from 'src/app/shared/pipes/character-length.pipe';
import { CharacterFocusTrackerDirective } from 'src/app/shared/directives/character-focus-tracker.directive';

@Component({
  selector: 'app-permission-detail',
  templateUrl: './permission-detail.component.html',
  styleUrls: ['./permission-detail.component.scss'],
  providers: [DialogService, AlertService, ConfirmationService],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PrimeImportsModule,
    NgIf,
    NgFor,
    Panel,
    Fieldset,
    Chip,
    ToggleSwitchModule,
    CharacterLengthPipe,
    CharacterFocusTrackerDirective,
  ],
})
export class PermissionDetailComponent implements OnInit, OnDestroy {
  private destroySubject: Subject<void> = new Subject();
  groupPanelDTO: GroupPanelDTO[] = [];
  permissionForm!: FormGroup;
  visible: boolean = false;
  Name: string = '';
  userRoles: Role[] = [];
  pagelabel: string = 'Add Permission';
  focusStates: { [key: string]: boolean } = {};

  permissionID: number = 0;
  isFormSaved: boolean = false;
  formSubmitted: boolean = false;

  constructor(
    private message: AlertService,
    private dialogService: DialogService,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService
  ) {
    this.permissionID = Number(this.route.snapshot.paramMap.get('id') ?? 0);
  }
  ngOnDestroy(): void {
    this.destroySubject.unsubscribe();
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.permissionID == 0
        ? this.createPermission()
        : this.updatePermission();
    }
  }

  ngOnInit(): void {
    this.initializedForm();
    if (this.permissionID > 0) {
      this.setPermissionDetails();
    } else {
      this.getDefaultOperations();
    }
  }

  private setPermissionDetails() {
    this.setPermissionValuesOnEdit(this.permissionID);
    this.pagelabel = 'Edit Permission';
  }

  createPermission() {
    const createPermissionCommand: PermissionCommand = {
      PermissionName: this.f['permissionGroupName'].value,
      GroupPanel: this.groupPanelDTO.map((panel) => ({
        ...panel,
        operations: panel.operations.filter((op) => op.access === true),
      })),
      Roles: this.userRoles.map((role) => role.roleID),
    };

    this.permissionService.savePermission(createPermissionCommand).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.isFormSaved = true;
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Permission Creation',
            'Permission has been successfully created.',
            2000
          );
        }
      },
      error: (error: ResponseResult<string>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error in saving Permission',
          error.messages?.[0]
        );
      },
    });
  }

  updatePermission() {
    const UpdateUserCommand: UpdatePermissionCommand = {
      PermissionID: this.permissionID,
      PermissionName: this.Name,
      GroupPanel: this.groupPanelDTO,
      Roles: this.userRoles.map((role) => role.roleID),
    };

    this.permissionService.updatePermission(UpdateUserCommand).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.isFormSaved = true;
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Permission Update',
            'Permission has been successfully updated.',
            2000
          );
        }
      },
      error: (error: ResponseResult<string>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error in saving Permission',
          error.messages?.[0]
        );
      },
    });
  }
  getDefaultOperations() {
    this.permissionService
      .getAllOperation()
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<GroupPanelDTO[]>) => {
          if (result.isSuccess) {
            if (result.responseData) {
              this.groupPanelDTO = result.responseData;
            }
          }
        },
        error: (error: ResponseResult<string>) => {
          this.message.showToast(
            MessageSeverity.error.toString(),
            'Error in Populating permissions',
            error.messages?.[0]
          );
        },
      });
  }

  assignRoles() {
    const ref = this.dialogService.open(SearchRoleComponent, {
      header: 'Roles Assignment',
      width: '45vw',
      modal: true,
      closable: true,
      contentStyle: { 'overflow-y': 'hidden' },
      baseZIndex: 10000,
      data: { userRoles: this.userRoles },
    });
    ref.onClose.subscribe((roles: Role[]) => {
      if (roles) {
        this.permissionForm.controls['roles'].setValue(roles);
        this.f['roles'].markAsTouched();
        this.userRoles = roles;
      }
      ref.destroy();
    });
  }

  removeRole(role: number) {
    this.userRoles = this.userRoles.filter((r) => r.roleID !== role);
  }

  setPermissionValuesOnEdit(permissionID: number): void {
    this.permissionService
      .getAllOperation()
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (operations: ResponseResult<GroupPanelDTO[]>) => {
          if (!operations.isSuccess || !operations.responseData) return;
          this.groupPanelDTO = operations.responseData;
          this.loadPermissionById(permissionID);
        },
        error: (error: ResponseResult<string>) => {
          this.message.showToast(
            MessageSeverity.error.toString(),
            'Error in populating operations',
            error.messages?.[0]
          );
        },
      });
  }

  private loadPermissionById(permissionID: number) {
    this.permissionService
      .searchPermissionbyID(permissionID)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (response: ResponseResult<PermissionSearchByIdDTO[]>) => {
          if (!response.isSuccess || !response.responseData) return;

          const dto = response.responseData[0];
          this.applyPermissionData(dto);
        },
        error: (error: ResponseResult<string>) => {
          this.message.showToast(
            MessageSeverity.error.toString(),
            'Error in Populating permissions',
            error.messages?.[0]
          );
        },
      });
  }

  private applyPermissionData(dto: PermissionSearchByIdDTO) {
    this.Name = dto.permissionGroupName;
    this.permissionForm.patchValue(dto);
    this.userRoles = dto.roles;

    dto.groupPanel.forEach((permissionPanel: GroupPanelDTO) => {
      const matchedPanel = this.groupPanelDTO.find(
        (p) => p.panel === permissionPanel.panel
      );
      if (matchedPanel) {
        matchedPanel.operations.forEach((operation: OperationsDTO) => {
          const matchedOp = permissionPanel.operations.find(
            (op) => op.operationID === operation.operationID
          );
          if (matchedOp) {
            operation.access = matchedOp.access;
          }
        });
      }
    });
  }

  closeDialog() {
    this.router.navigate(['/permission-management']);
  }
  reset() {
    if (this.permissionID > 0) {
      this.setPermissionValuesOnEdit(this.permissionID);
    } else {
      this.groupPanelDTO = [];
      this.userRoles = [];
      this.getDefaultOperations();
    }
  }

  onError(error: any) {
    this.message.showToast(
      MessageSeverity.error.toString(),
      'Error Occurred ',
      error
    );
  }
  confirm(event: Event) {
    if (this.permissionForm.touched && !this.isFormSaved) {
      this.confirmUnsavedChanges(event);
    } else {
      this.closeDialog();
    }
  }

  confirmUnsavedChanges(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Save Changes', 
      message: 'You have unsaved changes. Are you sure you want to leave this page?',
      icon: 'pi pi-exclamation-triangle',
         
      accept: () => {
        this.closeDialog();
      },
      reject: () => {},
    });
  }

  //reactive form
  get f() {
    return this.permissionForm.controls;
  }

  initializedForm() {
    this.permissionForm = this.formBuilder.group({
      permissionGroupName: ['', [Validators.required]],
      roles: [],
    });
  }
  readonly getErrorMessage = (
    control: AbstractControl | null,
    fieldName: string
  ): string | null =>
    getErrorMessage(this.validationService, control, fieldName);

  onFocusChange(field: string, isFocused: boolean) {
    this.focusStates[field] = isFocused;
  }
}
