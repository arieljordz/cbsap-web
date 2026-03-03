import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InvoiceStatusEnum } from '@core/enums';

export type AddReasonFormGroup = FormGroup<{
  invoiceID: FormControl<number | null>;
  status: FormControl<InvoiceStatusEnum | null>;
  reason: FormControl<string | null>;
}>;

export function createReasonForm(): AddReasonFormGroup {
  return new FormGroup({
    invoiceID:new FormControl<number | null>(null,[Validators.required]),
    status: new FormControl<InvoiceStatusEnum | null>(null, [Validators.required]),
    reason: new FormControl<string | null>('', [Validators.required]),
  });
}
