import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RoleManagerDTO } from '@core/model/roles-management';
import { AlertService, RoleService, ValidationService } from '@core/services';
import { getErrorMessage } from '@core/utils';
import { CharacterFocusTrackerDirective } from '@shared/directives/character-focus-tracker.directive';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { CharacterLengthPipe } from '@shared/pipes/character-length.pipe';
import { RoleManagerPopupComponent } from '@shared/popup/role-manager-popup/role-manaager-popup.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-basic-info',
  standalone: true,
  providers: [DialogService],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PrimeImportsModule,
    NgIf,
    CharacterLengthPipe,
    CharacterFocusTrackerDirective,
  ],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss',
})
export class BasicInfoComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() formSubmitted!: Boolean;

  focusStates: { [key: string]: boolean } = {};

  constructor(
    private roleService: RoleService,
    private message: AlertService,
    private validationService: ValidationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {}

  searchRoleManager1() {
    const ref = this.dialogService.open(RoleManagerPopupComponent, {
      header: 'Select Role Manager 1',
      baseZIndex: 10000,
      modal: true,
      closable: true,
    });

    ref.onClose.subscribe((role: RoleManagerDTO) => {
      if (role) {
        this.formGroup.patchValue({
          roleManager1: role.roleID,
          roleManager1Name: role.roleName,
        });
      }
    });
  }

  searchRoleManager2() {
    const ref = this.dialogService.open(RoleManagerPopupComponent, {
      header: 'Select Role Manager 2',
      baseZIndex: 10000,
      modal: true,
      closable: true,
    });

    ref.onClose.subscribe((role: RoleManagerDTO) => {
      if (role) {
        this.formGroup.patchValue({
          roleManager2: role.roleID,
          roleManager2Name: role.roleName,
        });
      }
    });
  }

  clearRoleManager(fieldPrefix: string): void {
    this.formGroup.patchValue({
      [`${fieldPrefix}`]: null, // clears role ID
      [`${fieldPrefix}Name`]: null, // clears role name
    });

    // Optionally, mark as touched or dirty if needed
    this.formGroup.get(`${fieldPrefix}`)?.markAsDirty();
    this.formGroup.get(`${fieldPrefix}Name`)?.markAsDirty();
  }

  get f() {
    return this.formGroup.controls;
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
