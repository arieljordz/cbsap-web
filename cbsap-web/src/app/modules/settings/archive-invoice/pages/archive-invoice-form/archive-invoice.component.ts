import { ArchiveInvSettingDto } from '@core/model/system-settings/archived-invoice/archive-invoice-setting.dto';
import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertService, ValidationService } from '@core/services';
import { SystemVariableService } from '@core/services/system-settings/system-variable.service';
import { getErrorMessage } from '@core/utils';
import { CharacterFocusTrackerDirective } from '@shared/directives/character-focus-tracker.directive';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { CharacterLengthPipe } from '@shared/pipes/character-length.pipe';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ResponseResult } from '@core/model/common';
import { MessageSeverity } from '@core/constants';

@Component({
  selector: 'app-archive-invoice',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PrimeImportsModule,
    NgIf,
    CharacterLengthPipe,
    CharacterFocusTrackerDirective,
  ],
  templateUrl: './archive-invoice.component.html',
  styleUrl: './archive-invoice.component.scss',
})
export class ArchiveInvoiceComponent implements OnInit, OnDestroy {
  title: string = 'Archive Invoice';
  focusStates: { [key: string]: boolean } = {};
  settingsForm!: FormGroup;
  private destroy$ = new Subject<void>();

  archiveInvoiceSetting?: ArchiveInvSettingDto | null;
  /**
   *
   */
  constructor(
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private systemVariableService: SystemVariableService,
    private message: AlertService
  ) {
    this.settingsForm = this.formBuilder.group({
      archiveDays: [90, [Validators.required, Validators.min(90)]],
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.loadArchiveInvoiceSetting();
  }

  onSubmit() {
    if (this.settingsForm.valid) this.updateArchiveInvSetting();
  }

  onFocusChange(field: string, isFocused: boolean) {
    this.focusStates[field] = isFocused;
  }

  get f() {
    return this.settingsForm.controls;
  }

  private loadArchiveInvoiceSetting() {
    combineLatest([this.systemVariableService.getArchiveInvoiceSetting()])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([response]) => {
        if (response.isSuccess) {
          this.archiveInvoiceSetting = response.responseData!;
          this.f['archiveDays'].setValue(this.archiveInvoiceSetting.value);
        }
      });
  }

  private updateArchiveInvSetting() {
    this.archiveInvoiceSetting!.value = String(this.f['archiveDays'].value);
    this.systemVariableService
      .updateArchiveInvoiceSetting(this.archiveInvoiceSetting!)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.message.showToast(
              MessageSeverity.success.toString(),
              'Archive Invoice',
              'Archive Invoice Setting is successfully updated',
              2000
            );
          }
        },
        error: (error: ResponseResult<boolean>) => {
          this.message.showToast(
            MessageSeverity.error.toString(),
            'Error on Saving  Archive Invoice',
            error.messages?.[0],
            2000
          );
        },
      });
  }

  readonly getErrorMessage = (
    control: AbstractControl | null,
    fieldName: string
  ): string | null =>
    getErrorMessage(this.validationService, control, fieldName);
}
