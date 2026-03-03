import { LockUnlockUserDTO } from '@core/model/user-management/dtos/LockUnlockUserDTO';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormControlOptions,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {
  CreateUserDTO,
  DeleteUserCommand,
  UpdateUserDTO,
  UserSearchPaginationDTO,
} from 'src/app/core/model/user-management/index';
import { Role } from 'src/app/core/model/user-management/role.model';
import { User } from 'src/app/core/model/user-management/user.model';
import {
  MenuService,
  RoleService,
  UserManagementService,
  ValidationService,
} from 'src/app/core/services';
import { MessageSeverity } from './../../../../core/constants/index';

import {
  getErrorMessage,
  MatchValidator,
  passwordValidator,
  rolesMinimumLengthValidator,
} from '../../../../core/utils/index';

import { NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { SearchRoleComponent } from 'src/app/shared/popup/search-role/search-role.component';
import { AlertService } from '../../../../core/services/index';

import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ResponseResult } from 'src/app/core/model/common';
import { RoleDTO } from 'src/app/core/model/roles-management';
import { CharacterLengthPipe } from 'src/app/shared/pipes/character-length.pipe';
import { PrimeImportsModule } from 'src/app/shared/moduleResources/prime-imports';
import { CharacterFocusTrackerDirective } from 'src/app/shared/directives/character-focus-tracker.directive';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  providers: [DialogService, AlertService, ConfirmationService],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PrimeImportsModule,
    NgIf,
    ToggleSwitchModule,
    NgForOf,
    CharacterLengthPipe,
    CharacterFocusTrackerDirective,
  ],
})
export class UserDetailsComponent implements OnInit, AfterViewInit {
  userForm!: FormGroup;
  formSubmitted: boolean = false;
  userAccountID: number = 0;
  isNewUser = true;
  @ViewChild('#userID') myUserID: ElementRef | undefined;
  user: User | null = null;
  userRoles: RoleDTO[] | null | undefined = [];
  pagelabel: string = 'Add User';

  userDto: UserSearchPaginationDTO | null | undefined;

  focusStates: { [key: string]: boolean } = {};
  //

  constructor(
    public dialogService: DialogService,
    private userService: UserManagementService,
    private message: AlertService,
    private confirmationService: ConfirmationService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private menuService: MenuService
  ) {
    this.userAccountID = Number(
      this.activeRoute.snapshot.params['userAccountID'] ?? 0
    );
  }

  ngOnInit() {
    this.initializeForm();
    this.userForm.updateValueAndValidity();

    if (this.userAccountID !== 0) {
      this.isNewUser = false;
      this.setUserDetail(this.userAccountID);
    } else {
      this.disablePasswordValidators();
    }
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  assignRoles() {
    const ref = this.dialogService.open(SearchRoleComponent, {
      header: 'Roles Assignment',
      width: '35vw',
      modal: true,
      closable: true,
      contentStyle: { 'overflow-y': 'hidden' },
      baseZIndex: 10000,
      data: { userRoles: this.userRoles },
    });

    ref.onClose.subscribe((roles: Role[]) => {
      if (roles) {
        this.userForm.controls['userRoles'].setValue(roles);
        this.f['userRoles'].markAsTouched();
        this.userRoles = roles;
      }
      ref.destroy();
    });
  }

  removeRole(role: number) {
    this.userRoles = this.userRoles?.filter((r) => r.roleID !== role);
    if (this.userRoles?.length === 0)
      this.userForm.controls['userRoles'].setErrors({ required: true });
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (this.isNewUser) {
        this.createUser();
      } else {
        this.updateUser();
      }
    }
  }

  cancel(event: Event) {
    if (this.userForm.touched || this.userForm.dirty) {
      this.confirmUnsavedChanges(event);
    } else {
      this.closeDialog();
    }
  }

  closeDialog() {
    this.router.navigate(['/user-management']);
  }
  //actions
  createUser() {
    const roleIDs = this.userRoles?.map((role) => role.roleID);
    this.userForm.patchValue({
      userRoles: roleIDs,
    });

    const createUserDto: CreateUserDTO = {
      ...this.userForm.value,
    };
    this.userService.createUser(createUserDto).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.message.showToast(
            MessageSeverity.success.toString(),
            'User Creation',
            'Your user profile has been successfully created.  Please check your email to activate your account',
            2000
          );
          this.userForm.patchValue({
            userRoles: this.userRoles,
          });
          this.closeDialog();
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on user Creation',
          error.messages?.[0],
          2000
        );
      },
    });
  }

  updateUser() {
    const roleIDs = this.userRoles?.map((role) => role.roleID);
    this.userForm.patchValue({
      userRoles: roleIDs,
    });

    const updateUserDTO: UpdateUserDTO = this.userForm.getRawValue();

    updateUserDTO.userAccountID = this.userAccountID;

    this.userService.updateUser(updateUserDTO).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Update User',
            'Update successfully saved',
            2000
          );
          this.userForm.patchValue({
            userRoles: this.userRoles,
          });
          this.resetFormValidtity();
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on user Creation',
          error.messages?.[0],
          2000
        );
      },
    });
  }

  resetFormValidtity() {
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.userForm.updateValueAndValidity();
  }

  softUserDeletion() {
    const deleteUserCommand: DeleteUserCommand = {
      userAccountID: this.userAccountID,
    };

    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete user : ' +
        this.f['userID'].value +
        '?',
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
              this.closeDialog();
            }
          });
      },
    });
  }

  lockUnlockUser() {
    if (!this.userDto) {
      this.message.showToast(
        MessageSeverity.error.toString(),
        'Lock/Unlock User',
        'User data not available',
        2000
      );
      return;
    }

    const wasLocked = this.userDto.isLockedOut;
    const lockUnlockUserDto: LockUnlockUserDTO = {
      UserAccountID: this.userAccountID,
      IsLockedOut: !this.userDto.isLockedOut,
    };

    this.userService.lockUser(lockUnlockUserDto).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          const action = wasLocked ? 'unlocked' : 'locked';

          // Update UI/state if necessary
          if (this.userDto) this.userDto.isLockedOut = !wasLocked;

          this.message.showToast(
            MessageSeverity.success.toString(),
            `User ${action.charAt(0).toUpperCase() + action.slice(1)}`,
            `User was successfully ${action}.`,
            2000
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error Locking/Unlocking User',
          error.messages?.[0] ?? 'An unexpected error occurred.',
          2000
        );
      },
    });
  }

  private setCredentialvalidator() {
    this.f['password'].setValidators([
      Validators.required,
      passwordValidator(),
    ]);
    this.f['confirmPassword'].setValidators([
      Validators.required,
      passwordValidator(),
    ]);
    this.userForm.setValidators([
      MatchValidator('password', 'confirmPassword'),
    ]);
  }

  private setUserDetail(userAccountID: number) {
    this.pagelabel = 'Edit User';
    this.enablePasswordValidators();
    this.getUserDetail(userAccountID);
    this.f['userID']?.disable({ emitEvent: false, onlySelf: true });
    this.f['passwordMandatory'].enable();
    this.f['passwordMandatory'].setValue(false);
  }

  private getUserDetail(userAccountId: number) {
    this.userService.searchByUserAccountID(userAccountId).subscribe({
      next: (response: ResponseResult<UserSearchPaginationDTO[]>) => {
        if (response.isSuccess) {
          this.userDto = response.responseData?.[0];
          this.userRoles = this.userDto?.userRoles;
          this.userForm.patchValue(this.userDto ?? []);
        }
      },
    });
  }

  private enablePasswordValidators() {
    this.f['passwordMandatory'].valueChanges.subscribe((value) => {
      if (value) {
        this.setCredentialvalidator();
      } else {
        this.disablePasswordValidators();
      }
    });
  }

  private disablePasswordValidators() {
    this.f['password'].clearValidators();
    this.f['password'].setErrors(null);
    this.f['confirmPassword'].clearValidators();
    this.f['confirmPassword'].setErrors(null);
    this.f['password'].updateValueAndValidity();
    this.f['confirmPassword'].updateValueAndValidity();
  }

  setFocus() {
    if (this.myUserID && this.myUserID.nativeElement) {
      this.myUserID.nativeElement.focus();
    }
  }
  //reactive form
  get f() {
    return this.userForm.controls;
  }

  initializeForm() {
    this.userForm = this.formBuilder.group(
      {
        userID: ['', Validators.required],
        emailAddress: ['', [Validators.required, Validators.email]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        passwordMandatory: [
          { value: this.isNewUser, disabled: this.isNewUser },
        ],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        isActive: [false],
        userRoles: new FormControl([], [rolesMinimumLengthValidator(1)]),
      },
      {
        validators: [MatchValidator('password', 'confirmPassword')],
      } as FormControlOptions
    );
  }

  confirmUnsavedChanges(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Save Changes',
      message:
        'You have unsaved changes. Are you sure you want to leave this page?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.closeDialog();
      },
      reject: () => {},
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
