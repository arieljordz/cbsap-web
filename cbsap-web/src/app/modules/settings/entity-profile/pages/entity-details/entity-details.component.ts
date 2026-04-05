import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { EntityProfileDto } from '@core/model/system-settings/entity/entityDto';
import { EntityService } from '@core/services/system-settings/entity.service';

import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { MessageSeverity } from '@core/constants';
import { ResponseResult } from '@core/model/common';
import {
  EntityProfileFormGroup,
  MatchingConfigFormGroup,
  createEntityProfileForm,
  createMatchingConfigGroup,
} from '@core/model/system-settings/entity/entity.index';
import { AlertService, ValidationService } from '@core/services';
import { getErrorMessage } from '@core/utils';
import { CharacterFocusTrackerDirective } from '@shared/directives/character-focus-tracker.directive';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { CharacterLengthPipe } from '@shared/pipes/character-length.pipe';
import { DateTimeFormatPipe } from '@shared/pipes/datetimeformat.pipe';

@Component({
  selector: 'app-entity-details',
  standalone: true,
  imports: [
    PrimeImportsModule,
    DateTimeFormatPipe,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    CharacterLengthPipe,
    CharacterFocusTrackerDirective,
    NgForOf,
  ],
  providers: [DialogService, AlertService, ConfirmationService],
  templateUrl: './entity-details.component.html',
  styleUrl: './entity-details.component.scss',
})
export class EntityDetailsComponent implements OnInit {
  pagelabel: string = 'Add Entity';
  entityForm!: EntityProfileFormGroup;
  isFormSaved: boolean = false;
  entityDropdown: Record<string, SelectItem[]> = {};
  focusStates: { [key: string]: boolean } = {};
  entityProfileID: number = 0;

  constructor(
    private confirmationService: ConfirmationService,
    private entityService: EntityService,
    private validationService: ValidationService,
    private message: AlertService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.entityForm = createEntityProfileForm();
    this.entityProfileID = Number(
      this.activeRoute.snapshot.params['entityProfileID'] ?? 0
    );
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initiliazeDropdown();

    if (this.entityProfileID != 0) {
      this.pagelabel = 'Edit Entity';
      this.loadEntityForEdit(this.entityProfileID);
    }
  }

  cancel(event: Event) {
    if (this.entityForm.touched && !this.isFormSaved) {
      this.confirmUnsavedChanges(event);
    } else {
      this.closeDialog();
    }
  }

  private confirmUnsavedChanges(event: Event) {
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

  closeDialog() {
    this.router.navigate(['/entity-profile-management']);
  }
  get f() {
    return this.entityForm.controls;
  }

  private initializeForm() {
    this.initializeDefaultConfigs();
  }

  private initiliazeDropdown() {
    this.entityService.getDropdownOptions().subscribe({
      next: (dropdown) => {
        this.entityDropdown = dropdown;
      },
    });
  }

  
  deleteConfirmation() {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete entity : ' +
        this.f['entityName'].value +
        '?',
     header: 'Confirm Deletion', 
      accept: () => {
        this.deleteEntity();
      },
    });
  }

  private deleteEntity() {
    this.entityService
      .deleteEntity(this.entityProfileID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.isFormSaved = true;
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Entity Deletion',
            'Your  user entity has been successfully deleted',
            2000
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on Entity Deletion',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.closeDialog();
      }
    });
  }

  onSubmit(): void {
    const formValue: EntityProfileDto =
      this.entityForm.getRawValue() as EntityProfileDto;

    if (this.entityForm.valid) {
      if (this.entityProfileID === 0) {
        this.addNewEntity(formValue);
      } else {
        this.updateEntity(formValue);
      }
    }
  }

  private addNewEntity(formValue: EntityProfileDto) {
    const cleanedMatching = this.matchingConfigNullnhandling(formValue);

    formValue.matchingConfigs =
      cleanedMatching.length > 0 ? cleanedMatching : null;

    this.entityService.createEntity(formValue).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.isFormSaved = true;
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Entity Creation',
            'Your user Entity has been successfully created',
            2000
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on Entity Creation',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.closeDialog();
      }
    });
  }
  private matchingConfigNullnhandling(formValue: EntityProfileDto) {
    const isEmptyConfig = (config: any) =>
      Object.entries(config)
        .filter(([key]) => key !== 'configType')
        .every(([, val]) => val === null || val === '' || val === 0);

    const cleanedMatching =
      formValue.matchingConfigs?.filter((item: any) => !isEmptyConfig(item)) ||
      [];
    return cleanedMatching;
  }

  private updateEntity(formValue: EntityProfileDto) {
    const cleanedMatching = this.matchingConfigNullnhandling(formValue);
    formValue.matchingConfigs =
      cleanedMatching.length > 0 ? cleanedMatching : null;
       this.entityService.updateEntity(formValue).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.isFormSaved = true;
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Entity Creation',
            'Your user Entity has been successfully updated',
            2000
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on Entity Creation',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.closeDialog();
      }
    });
  }

  get matchingConfigs(): FormArray<MatchingConfigFormGroup> {
    return this.f['matchingConfigs'] as FormArray<MatchingConfigFormGroup>;
  }

  private loadEntityForEdit(entityProfileID: number) {
    combineLatest([
      this.entityService.getDropdownOptions(),
      this.entityService.getEntityByID(entityProfileID),
    ]).subscribe(([dropdowns, response]) => {
      this.entityDropdown = {
        matchingLevel: dropdowns.matchingLevel,
        invoiceMatchBasis: dropdowns.invoiceMatchBasis,
        allowPresets: dropdowns.allowPresets,
      };
      if (response.isSuccess) {
        const entity = response.responseData;
        this.entityForm.patchValue({
          ...entity,
          matchingConfigs: [],
        });

        this.f['entityName'].disable();
        this.f['entityCode'].disable();

        this.matchingConfigs.clear();

        if (entity?.matchingConfigs && entity.matchingConfigs.length > 0) {
          entity!.matchingConfigs?.forEach((cfg) => {
            const configGroup = createMatchingConfigGroup(cfg);
            this.matchingConfigs.push(configGroup);
          });
        } else {
          this.initializeDefaultConfigs();
        }
      }
    });
  }

  private initializeDefaultConfigs(): void {
    ['POMT','PO', 'GR'].forEach((type) => {
      const configGroup = createMatchingConfigGroup({
        configType: type as  'PO'|'GR',
      });
      this.matchingConfigs.push(configGroup);
    });
  }

  getPanelTitle(configType: 'POMT'|'PO'| 'GR' | string): string {
    switch (configType) {
      case 'POMT':
        return 'Purchase Order Match Type';
      case 'PO':
    return 'Purchace Order Variance';
    case 'GR':
      default:
        return 'Matching Configuration';
    }
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
