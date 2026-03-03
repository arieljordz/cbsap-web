import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupOptionsService } from '@core/services/lookups/lookup-options.service';
import { getErrorMessage } from '@core/utils';
import { CharacterFocusTrackerDirective } from '@shared/directives/character-focus-tracker.directive';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { CharacterLengthPipe } from '@shared/pipes/character-length.pipe';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { TaxCode } from 'src/app/core/model/taxcode-management';
import { AlertService, TaxCodeService, ValidationService } from 'src/app/core/services';
import { MessageSeverity } from '../../../../core/constants/index';

@Component({
  selector: 'taxcode-editor',
  templateUrl: './taxcode-editor.component.html',
  styleUrls: ['./taxcode-editor.component.scss'],
  providers: [AlertService, ConfirmationService],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PrimeImportsModule,
    NgIf,
    CharacterLengthPipe,
    CharacterFocusTrackerDirective,
  ],
})
export class TaxCodeEditorComponent implements OnInit {
  private destroy$ = new Subject<void>();
  pagelabel: string = 'Add Tax Code';
  taxCodeForm!: FormGroup;
  formSubmitted: boolean = false;
  focusStates: { [key: string]: boolean } = {};
  taxCodeId: number = 0;
  entityOptions?: SelectItem[] = [];

  constructor(
    private lookOptionService: LookupOptionsService,
    private taxCodeService: TaxCodeService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private validationService: ValidationService,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.taxCodeForm = this.formBuilder.group({
      entityID: ['', [Validators.required]],
      taxCodeName: ['', [Validators.required]],
      code: ['', []],
      taxRate: [0, [Validators.required]],
    });

    this.taxCodeId = Number (
      this.activeRoute.snapshot.params['taxCodeID'] ?? 0
    );
  }
  
  readonly entityOptions$ = this.lookOptionService.entityOptions$;

  ngOnInit() {
    this.initializeDropdown();

    if (this.taxCodeId > 0) {
      this.pagelabel = 'Edit Tax Code';
      this.loadTaxCode(this.taxCodeId);
    }
  }

  loadTaxCode(taxCodeId: Number) {
        combineLatest([
          this.taxCodeService.getTaxCodeById(taxCodeId),
          this.entityOptions$
        ]).subscribe(
          ([
            response,
            entityOptions
          ]) => {
    
            this.entityOptions = entityOptions;
    
            if (response.isSuccess) {
              const taxCode = response.responseData;
              this.taxCodeForm.patchValue({
                ...taxCode,
              });
            }
          }
        );
  }
  
  private initializeDropdown() {
    this.entityOptions$.pipe(takeUntil(this.destroy$)).subscribe((options) => {
      this.entityOptions = options;
    });
  }

  get f() {
    return this.taxCodeForm.controls;
  }

  onSubmit() {
    const taxCodeValues: TaxCode = this.taxCodeForm.getRawValue() as TaxCode;

    if (this.taxCodeForm.valid) {
      if (this.taxCodeId > 0) {
        this.updateTaxCode(taxCodeValues);
      } else {
        this.createTaxCode(taxCodeValues);
      }
    }
  }

  createTaxCode(taxCode: TaxCode) {
    this.taxCodeService.createTaxCode(taxCode).subscribe((response) => {
      if (response.isSuccess) {
        this.formSubmitted = true;
        this.alertService.showToast(
          MessageSeverity.success.toString(),
          'Create Tax Code',
          'Tax Code has been successfully created.'
        );
        this.closeDialog();
      }
    });
  }

  updateTaxCode(taxCode: TaxCode) {
    this.taxCodeService
      .updateTaxCode(taxCode, this.taxCodeId)
      .subscribe((response) => {
        if (response.isSuccess) {
          this.formSubmitted = true;
          this.alertService.showToast(
            MessageSeverity.success.toString(),
            'Update Tax Code',
            'Tax Code has been successfully updated.'
          );
        }
      });
  }

  resetForm() {
    this.formSubmitted = false;
    this.taxCodeForm.reset();
  }

  cancel(event: Event) {
    if (this.taxCodeForm.touched && !this.formSubmitted) {
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

  closeDialog() {
    this.router.navigate(['/taxcode-management']);
  }

  onError(error: any) {
    //handle error
  }

  onFocusChange(field: string, isFocused: boolean) {
    this.focusStates[field] = isFocused;
  }

  readonly getErrorMessage = (
    control: AbstractControl | null,
    fieldName: string
  ): string | null =>
    getErrorMessage(this.validationService, control, fieldName);
}
