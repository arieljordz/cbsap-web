import { CommonModule, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageSeverity } from '@core/constants';
import {
  InvoiceActionButton,
  InvoiceQueue,
  InvoiceStatusEnum,
} from '@core/enums';
import { ResponseResult } from '@core/model/common';
import {
  AddReasonFormGroup,
  createReasonForm,
} from '@core/model/invoicing/invoice-status-change/invoice-status-change.form';
import {
  QueueActionConfigMap,
  QueueConfig,
  Severity,
} from '@core/model/invoicing/invoice-status-change/invoice-status.change.config';
import { InvStatusChangeDto } from '@core/model/invoicing/invoice/invoice-info.dto';
import { AlertService, ValidationService } from '@core/services';
import { InvoiceDetailService } from '@core/services/invoicing/invoice-detail.service';
import { getErrorMessage } from '@core/utils/shared-utils';
import { CharacterFocusTrackerDirective } from '@shared/directives/character-focus-tracker.directive';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { CharacterLengthPipe } from '@shared/pipes/character-length.pipe';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-invoice-status-change',
  standalone: true,
  providers: [DialogService, AlertService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    PrimeImportsModule,
    ButtonModule,
    NgIf,
    CharacterFocusTrackerDirective,
    CharacterLengthPipe,
  ],
  templateUrl: './invoice-status-change.component.html',
  styleUrl: './invoice-status-change.component.scss',
})
export class InvoiceStatusChangeComponent implements OnInit, OnDestroy {
  private destroySubject: Subject<void> = new Subject();
  invAddReasonForm!: AddReasonFormGroup;
  invoiceID: number = 0;
  queueroute: number = 0;
  action?: InvoiceActionButton;

  buttonName: string = '';
  modalTitle: string = '';

  focusStates: { [key: string]: boolean } = {};

  constructor(
    private validationService: ValidationService,
    private invDetail: InvoiceDetailService,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private message: AlertService
  ) {
    this.invAddReasonForm = createReasonForm();
    this.invoiceID = (this.config.data?.invoiceID as number) ?? 0;
    this.queueroute = (this.config.data?.queue as number) ?? 0;
    this.action =
      (this.config.data?.action as InvoiceActionButton) ?? undefined;
  }

  ngOnInit(): void {
    this.f['invoiceID'].setValue(this.invoiceID);
    this.f['status'].setValue(this.currentQueueConfig?.status!);
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  onSubmit() {
    const formValue: InvStatusChangeDto =
      this.invAddReasonForm.getRawValue() as InvStatusChangeDto;
    if (this.invAddReasonForm.valid) {
      switch (this.action) {
        case InvoiceActionButton.Hold:
          this.Holdinvoice(formValue);
          break;
        case InvoiceActionButton.Reject:
          this.rejectInvoice(formValue);
          break;
        case InvoiceActionButton.Reactivate:
          this.reactivateInvoice(formValue);
          break;
        case InvoiceActionButton.RouteToException:
          this.routeToException(formValue);
          break;
        default:
          throw new Error('Invalid action');
      }
    }
  }

  private Holdinvoice(formValue: InvStatusChangeDto) {
    this.invDetail.forHold(formValue).subscribe({
      next: (response) => {
        if (response.isSuccess) {
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on Adding Reason',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.cancel();
      },
    });
  }

  private routeToException(formValue: InvStatusChangeDto) {
    this.invDetail.routeToException(formValue).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Invoice routed to Exception successfully',
            '',
            2000
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on route to Exception',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.cancel();
      },
    });
  }

  private rejectInvoice(formValue: InvStatusChangeDto) {
    this.invDetail.forReject(formValue).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Invoice rejected successfully',
            '',
            2000
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on invoice rejection',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.cancel();
      },
    });
  }

  private reactivateInvoice(formValue: InvStatusChangeDto) {
    this.invDetail.reactivate(formValue).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Invoice reactivated successfully',
            '',
            2000
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on invoice reactivation',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.cancel();
      },
    });
  }

  cancel() {
    this.dialogRef.close(true);
  }

  get f() {
    return this.invAddReasonForm.controls;
  }

  onFocusChange(field: string, isFocused: boolean) {
    this.focusStates[field] = isFocused;
  }

  readonly getErrorMessage = (
    control: AbstractControl | null,
    fieldName: string
  ): string | null =>
    getErrorMessage(this.validationService, control, fieldName);

  get currentQueue(): InvoiceQueue | null {
    return this.queueroute;
  }

  get currentQueueConfig(): QueueConfig | null {
    return this.currentQueue && this.action
      ? QueueActionConfigMap[this.currentQueue]?.[this.action] ?? null
      : null;
  }

  get saveButtonLabel(): string {
    return this.currentQueueConfig?.buttonLabel ?? 'Save';
  }
  get configColor(): string {
    const color = this.currentQueueConfig?.color;
    return color ?? 'secondary';
  }

  get buttonSeverity(): Severity {
    return this.invAddReasonForm.invalid
      ? 'secondary'
      : (this.configColor as Severity);
  }
}
