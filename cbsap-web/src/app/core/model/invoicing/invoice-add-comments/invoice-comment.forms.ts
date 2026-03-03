import { FormControl, FormGroup, Validators } from '@angular/forms';

export type AddCommentFormGroup = FormGroup<{
  invoiceCommentID: FormControl<number | null>;
  invoiceID: FormControl<number|null>;
  comment: FormControl<string | null>;
}>;

export function createCommentForm(): AddCommentFormGroup {
  return new FormGroup({
    invoiceCommentID: new FormControl<number | null>(0),
    invoiceID:new FormControl<number | null>(null,[Validators.required]),
    comment: new FormControl<string | null>('', [Validators.required]),
  });
}
