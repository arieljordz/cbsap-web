import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {
  createSupplierInfoForm,
  SupplierInfoDto,
  SupplierInfoFormGroup,
} from '@core/model/system-settings/supplier/supplier.index';
import {
  AlertService,
  SupplierInfoService,
  ValidationService,
} from '@core/services';
import { getErrorMessage } from '@core/utils';
import { CharacterFocusTrackerDirective } from '@shared/directives/character-focus-tracker.directive';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { CharacterLengthPipe } from '@shared/pipes/character-length.pipe';

import { LookupOptionsService } from '@core/services/lookups/lookup-options.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { MessageSeverity } from '@core/constants';
import { ResponseResult } from '@core/model/common';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PrimeImportsModule,
    CharacterLengthPipe,
    CharacterFocusTrackerDirective,
    NgIf,
  ],
  providers: [DialogService, AlertService, ConfirmationService],
  templateUrl: './supplier-detail.component.html',
  styleUrl: './supplier-detail.component.scss',
})
export class SupplierDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  supplierForm!: SupplierInfoFormGroup;
  pagelabel: string = 'Add Supplier';
  focusStates: { [key: string]: boolean } = {};
  supplierInfoID: number = 0;
  isFormSaved: boolean = false;

  supplierInfoDropdown: Record<string, SelectItem[]> = {};
  entityOptions?: SelectItem[] = [];
  accountsOptions?: SelectItem[] = [];
  invRoutingFlowOptions?: SelectItem[] = [];
  taxCodeOptions?: SelectItem[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private supplierInfoService: SupplierInfoService,
    private lookOptionService: LookupOptionsService,

    private validationService: ValidationService,
    private message: AlertService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.supplierForm = createSupplierInfoForm();
    this.supplierInfoID = Number(
      this.activeRoute.snapshot.params['supplierInfoID'] ?? 0
    );
  }

  readonly entityOptions$ = this.lookOptionService.entityOptions$;
  readonly accountsLookupOptions$ =
    this.lookOptionService.accountsLookupOptions$;
  readonly invRoutingFlowLookUpOptions$ =
    this.lookOptionService.invRoutingFlowLookUpOptions$;

  readonly taxCodeLookUpOptions$ = this.lookOptionService.taxCodeLookUpOptions$;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.initiliazeDropdown();

    if (this.supplierInfoID !== 0) {
      this.pagelabel = 'Edit Supplier';
      this.loadSupplierForEdit(this.supplierInfoID);
    }
  }

  onSubmit() {
    const formValue: SupplierInfoDto =
      this.supplierForm.getRawValue() as SupplierInfoDto;

    if (this.supplierForm.valid) {
      if (this.supplierInfoID === 0) {
        this.addSupplier(formValue);
      } else {
        this.updateSupplier(formValue);
      }
    }
  }

  private addSupplier(formValue: SupplierInfoDto) {
   
    this.supplierInfoService.createSupplier(formValue).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.isFormSaved = true;
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Supplier  Creation',
            'Your supplier has been successfully created',
            2000
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on Supplier Creation',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
         this.closeDialog();
      },
    });
  }
  private updateSupplier(formValue: SupplierInfoDto) {
    this.supplierInfoService.updateSuppler(formValue).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          // this.isFormSaved = true;
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Supplier  Update',
            'Your supplier has been successfully updated',
            2000
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on Supplier Creation',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.closeDialog();
      },
    });
  }

  private loadSupplierForEdit(supplierInfoID: number) {
    combineLatest([
      this.supplierInfoService.getDropdownOptions(),
      this.supplierInfoService.getSupplierByID(supplierInfoID),
      this.entityOptions$,
      this.accountsLookupOptions$,
      this.invRoutingFlowLookUpOptions$,
      this.taxCodeLookUpOptions$,
    ]).subscribe(
      ([
        dropdown,
        response,
        entityOptions,
        accountsLookupOptions,
        invRoutingFlowLookUpOptions,
        taxCodeLookUpOptions,
      ]) => {
        this.supplierInfoDropdown = {
          currencies: dropdown.currencies,
          paymentTerms: dropdown.paymentTerms,
        };

        this.entityOptions = entityOptions;
        this.accountsOptions = accountsLookupOptions;
        this.invRoutingFlowOptions = invRoutingFlowLookUpOptions;
        this.taxCodeOptions = taxCodeLookUpOptions;

        if (response.isSuccess) {
          const supplier = response.responseData;
          this.supplierForm.patchValue({
            ...supplier,
          });
        }
      }
    );
  }

  cancel(event: Event) {
    if (this.supplierForm.touched && !this.isFormSaved) {
      this.confirmUnsavedChanges(event);
    } else {
      this.closeDialog();
    }
  }

  get f() {
    return this.supplierForm.controls;
  }

  confirmUnsavedChanges(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'You have unsaved changes. Are you sure you want to leave this page?',
     
      accept: () => {
        this.closeDialog();
      },
      reject: () => {},
    });
  }

  private initiliazeDropdown() {
    this.supplierInfoService.getDropdownOptions().subscribe({
      next: (dropdown) => {
        this.supplierInfoDropdown = dropdown;
      },
    });
    this.entityOptions$.pipe(takeUntil(this.destroy$)).subscribe((options) => {
      this.entityOptions = options;
    });
    this.accountsLookupOptions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((options) => {
        this.accountsOptions = options;
      });
    this.taxCodeLookUpOptions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((options) => {
        this.taxCodeOptions = options;
      });
    this.invRoutingFlowLookUpOptions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((options) => {
        this.invRoutingFlowOptions = options;
      });
  }

  deleteConfirmation() {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete supplier : ' +
        this.f['supplierID'].value +
        '?',
     header: 'Confirm Deletion', 
      accept: () => {
        this.deleteSupplier();
      },
    });
  }

  private deleteSupplier() {
    this.supplierInfoService
      .deleteSupplier(this.supplierInfoID)
      .subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.isFormSaved = true;
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Supoplier Deletion',
            'Supplier has been successfully deleted',
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

  closeDialog() {
    this.router.navigate(['/supplier-management']);
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
