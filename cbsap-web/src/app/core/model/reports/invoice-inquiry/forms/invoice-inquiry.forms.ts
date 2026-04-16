import { FormGroup, FormControl, Validators } from '@angular/forms';

export type InvoiceEnquiryFormGroup = FormGroup<{
  invoiceID: FormControl<number | null>;
  supplierName: FormControl<string | null>;
  invoiceDate: FormControl<Date | null>;
  invoiceNumber: FormControl<string | null>;
  poNumber: FormControl<string | null>;
  dueDate: FormControl<Date | null>;
  grossAmount: FormControl<string | null>;
  nextRole: FormControl<string | null>;
  exceptionReason: FormControl<string | null>;
  status: FormControl<string | null>;
}>;

export function createInvoiceEnquiryForm(): InvoiceEnquiryFormGroup {
  return new FormGroup({
    invoiceID: new FormControl<number | null>(null),

    supplierName: new FormControl<string | null>(null, Validators.required),

    invoiceDate: new FormControl<Date | null>(null, Validators.required),

    invoiceNumber: new FormControl<string | null>(null, Validators.required),

    poNumber: new FormControl<string | null>(null),

    dueDate: new FormControl<Date | null>(null),

    grossAmount: new FormControl<string | null>(null),

    nextRole: new FormControl<string | null>(null),

    exceptionReason: new FormControl<string | null>(null),

    status: new FormControl<string | null>(null),
  });
}