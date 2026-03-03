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
import { AlertService, KeywordService, LookUpsService, ValidationService } from 'src/app/core/services';
import { MessageSeverity } from '../../../../core/constants/index';
import { Keyword } from '@core/model/keyword-management/index';
import { ResponseResult } from '@core/model/common';

@Component({
  selector: 'keyword-editor',
  templateUrl: './keyword-editor.component.html',
  styleUrls: ['./keyword-editor.component.scss'],
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
export class KeywordEditorComponent implements OnInit {
  private destroy$ = new Subject<void>();
  pagelabel: string = 'Add Keyword';
  keywordForm!: FormGroup;
  formSubmitted: boolean = false;
  focusStates: { [key: string]: boolean } = {};
  keywordId: number = 0;
  entityOptions?: SelectItem[] = [];
  invoiceRoutingFlowOptions?: SelectItem[] = [];

  constructor(
    private lookOptionService: LookupOptionsService,
    private lookupService: LookUpsService,
    private keywordService: KeywordService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private validationService: ValidationService,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {

    this.keywordForm = this.formBuilder.group({
      entityProfileID: ['', []],
      invoiceRoutingFlowID: ['', [Validators.required]],
      keywordName: ['', [Validators.required]],
      isActive: [true, []],
    });

    this.keywordId = Number(
      this.activeRoute.snapshot.params['keywordID'] ?? 0
    );
  }

  readonly entityOptions$ = this.lookOptionService.entityOptions$;

  ngOnInit() {
    this.initializeDropdown();
    if (this.keywordId > 0) {
      this.pagelabel = 'Edit Keyword';
      this.loadKeyword(this.keywordId);
    }
    else {
      this.showMessage();
    }
  }

  loadKeyword(keywordId: Number) {
    combineLatest([
      this.keywordService.getKeywordById(keywordId),
      this.entityOptions$
    ]).subscribe(
      ([
        response,
        entityOptions
      ]) => {

        this.entityOptions = entityOptions;
        
        if (response.isSuccess) {
          const keyword = response.responseData;
          this.keywordForm.patchValue({
            ...keyword,
          });

          const entityProfileId = this.keywordForm.get('entityProfileID')?.value;
          if (entityProfileId) {
            this.populateInvoiceRoutingFlows(entityProfileId);
          }
        }
      }
    );
  }

  showMessage(){
    this.confirmationService.confirm({
      message:
        'Collaboration with CBS may be necessary to ensure the required Keyword value is being extracted by CBS capture system. <br/> Please engage your CBS Account Manager if capture changes are required',
      header: 'Information',
      rejectVisible: false,
      acceptLabel: 'OK',
      accept: () => {
      },
    });
  }

  deleteConfirmation() {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete this keyword?',
      header: 'Confirm Deletion',
      rejectVisible: true,
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.deleteKeyword();
      },
    });
  }

  private deleteKeyword() {
    this.keywordService
      .deleteKeyword(this.keywordId).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.alertService.showToast(
              MessageSeverity.success.toString(),
              'Keyword Deletion',
              'Keyword has been successfully deleted',
              2000
            );
          }
        },
        error: (error: ResponseResult<boolean>) => {
          this.alertService.showToast(
            MessageSeverity.error.toString(),
            'Error on Keyword Deletion',
            error.messages?.[0],
            2000
          );
        },
        complete: () => {
          this.closeDialog();
        }
      });
  }

  private initializeDropdown() {
    this.entityOptions$.pipe(takeUntil(this.destroy$)).subscribe((options) => {
      this.entityOptions = options;
    });
    this.populateInvoiceRoutingFlows(0);
  }

  private populateInvoiceRoutingFlows(entityID:number) {
     this.lookupService.getInvRoutingFlowByEntityIDLookUps(entityID).subscribe(invRoutingFlowsResponse => {
              this.invoiceRoutingFlowOptions = 
                (invRoutingFlowsResponse.responseData ?? []).map((routingFlow) => ({
                  label: routingFlow.invRoutingFlowName,
                  value: routingFlow.invRoutingFlowID
                }));
          });
  }

  entityChange(event: any) {
    const selectedEntityId = event.value as number;
    this.keywordForm.get('invoiceRoutingFlowID')?.setValue(null);
    this.populateInvoiceRoutingFlows(selectedEntityId || 0);
  }

  get f() {
    return this.keywordForm.controls;
  }

  onSubmit() {
    const keywordValues: Keyword = this.keywordForm.getRawValue() as Keyword;

    if (this.keywordForm.valid) {
      const entityProfileId = this.keywordForm.get('entityProfileID')?.value
      keywordValues.entityProfileID = entityProfileId ? entityProfileId : null;
      if (this.keywordId > 0) {
        this.updateKeyword(keywordValues);
      } else {
        this.createKeyword(keywordValues);
      }
    }
  }

  createKeyword(keyword: Keyword) {
    this.keywordService.createKeyword(keyword).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.formSubmitted = true;
          this.alertService.showToast(
            MessageSeverity.success.toString(),
            'Create Keyword',
            'Keyword has been successfully created.'
          );
          this.closeDialog();
        }
      },
      error: (error) => this.onError(error)
    });

  }

  updateKeyword(keyword: Keyword) {
    this.keywordService
      .updateKeyword(keyword, this.keywordId)
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.formSubmitted = true;
            this.alertService.showToast(
              MessageSeverity.success.toString(),
              'Update Keyword',
              'Keyword has been successfully updated.'
            );
          }
        },
        error: (error) => this.onError(error)
      });
  }

  resetForm() {
    this.formSubmitted = false;
    this.keywordForm.reset();
  }

  cancel(event: Event) {
    if (this.keywordForm.touched && !this.formSubmitted) {
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
      rejectVisible: true,
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.closeDialog();
      },
      reject: () => { },
    });
  }

  closeDialog() {
    this.router.navigate(['/keyword-management']);
  }

  onError(error: ResponseResult<any>) {
    this.alertService.showToast(MessageSeverity.error, 'Error', error.messages?.join(', '));
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
