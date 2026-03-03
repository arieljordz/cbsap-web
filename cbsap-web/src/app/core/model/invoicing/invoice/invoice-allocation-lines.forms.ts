import { FormGroup, FormControl, FormArray, FormsModule } from '@angular/forms';
import { FreeFieldDto, LineDimensionDto } from './invoice-allocation-lines.dto';

export type LineDimensionFormGroup = FormGroup<{
  key: FormControl<string | null>;
  value: FormControl<string | null>;
}>;

export type LinefreeFieldsFormGroup = FormGroup<{
  key: FormControl<string | null>;
  value: FormControl<string | null>;
}>;

// export type InvAllocationLineFormGroup = FormGroup<{
//   lineNo: FormControl<string | null>;
//   poNo: FormControl<string | null>;
//   poLineNo: FormControl<string | null>;
//   account: FormControl<string | null>;
//   lineDescription: FormControl<string | null>;
//   qty: FormControl<number | null>;
//   lineNetAmount: FormControl<number | null>;
//   lineTaxAmount: FormControl<number | null>;
//   lineAmount: FormControl<number | null>;
//   currency: FormControl<string | null>;
//   taxCodeID: FormControl<number | null>;
//   lineApproved: FormControl<string | null>;
//   note: FormControl<string | null>;
//   dimensions: FormArray<LineDimensionFormGroup>;
//   freeFields: FormArray<LinefreeFieldsFormGroup>;
// }>;

// export function createInvAllocationlineForm(): InvAllocationLineFormGroup {
//   return new FormGroup({
//     lineNo: new FormControl<string | null>(null),
//     poNo: new FormControl<string | null>(null),
//     poLineNo: new FormControl<string | null>(null),
//     account: new FormControl<string | null>(null),
//     lineDescription: new FormControl<string | null>(null),
//     qty: new FormControl<number | null>(null),
//     lineNetAmount: new FormControl<number | null>(null),
//     lineTaxAmount: new FormControl<number | null>(null),
//     lineAmount: new FormControl<number | null>(null),
//     currency: new FormControl<string | null>(null),
//     taxCodeID: new FormControl<number | null>(null),
//     lineApproved: new FormControl<string | null>(null),
//     note: new FormControl<string | null>(null),
//     dimensions: new FormArray<LineDimensionFormGroup>([]),
//     freeFields: new FormArray<LinefreeFieldsFormGroup>([]),
//   });
// }

export function createFreeFieldFormGroup(
  data?: Partial<FreeFieldDto>
): FormGroup {
  return new FormGroup({
    key: new FormControl(data?.key ?? '', { nonNullable: true }),
    value: new FormControl(data?.value ?? '', { nonNullable: true }),
  });
}
export function createLineDimensionFormGroup(
  data?: Partial<LineDimensionDto>
): FormGroup {
  return new FormGroup({
    key: new FormControl(data?.key ?? '', { nonNullable: true }),
    value: new FormControl(data?.value ?? '', { nonNullable: true }),
  });
}

// New Implementation
export type InvAllocationLineFormGroup = FormGroup<{
  invAllocLineID: FormControl<number | null>;
  invoiceID: FormControl<number | null>;
  lineNo: FormControl<number | null>;
  // account: FormControl<string | null>;
  // dimension1: FormControl<string | null>;
  // dimension2: FormControl<string | null>;
  // dimension3: FormControl<string | null>;
  // dimension4: FormControl<string | null>;
  poNo: FormControl<string | null>;
  account: FormControl<number | null>;
  accountDisplay: FormControl<string | null>;
  poLineNo: FormControl<string | null>;
  qty: FormControl<number | null>;
  lineDescription: FormControl<string | null>;
  note: FormControl<string | null>;
  lineNetAmount: FormControl<number | null>;
  taxCodeID: FormControl<number | null>;
  lineTaxAmount: FormControl<number | null>;
  lineAmount: FormControl<number | null>;
  isFromPOMatching: FormControl<boolean | null>;
}>;

export function createInvAllocationlineForm(
  initial?: Partial<InvAllocationLineFormGroup['value']>
): InvAllocationLineFormGroup {
  return new FormGroup({
    invAllocLineID: new FormControl<number | null>(
      initial?.invAllocLineID ?? null
    ),
    invoiceID: new FormControl<number | null>(initial?.invoiceID ?? null),
    lineNo: new FormControl<number | null>(initial?.lineNo ?? null),
    // account: new FormControl<string | null>(initial?.account ?? null),
    // dimension1: new FormControl<string | null>(initial?.dimension1 ?? null),
    // dimension2: new FormControl<string | null>(initial?.dimension2 ?? null),
    // dimension3: new FormControl<string | null>(initial?.dimension3 ?? null),
    // dimension4: new FormControl<string | null>(initial?.dimension4 ?? null),
    poNo: new FormControl<string | null>(initial?.poNo ?? null),
    poLineNo: new FormControl<string | null>(initial?.poLineNo ?? null),
    account: new FormControl<number | null>(initial?.account ?? null),
    accountDisplay: new FormControl<string | null>(
      initial?.accountDisplay ?? null
    ),
    qty: new FormControl<number | null>(initial?.qty ?? null),
    lineDescription: new FormControl<string | null>(
      initial?.lineDescription ?? null
    ),
    note: new FormControl<string | null>(initial?.note ?? null),
    lineNetAmount: new FormControl<number | null>(
      initial?.lineNetAmount ?? null
    ),
    taxCodeID: new FormControl<number | null>(initial?.taxCodeID ?? null),
    lineTaxAmount: new FormControl<number | null>(
      initial?.lineTaxAmount ?? null
    ),
    lineAmount: new FormControl<number | null>(initial?.lineAmount ?? null),
    isFromPOMatching: new FormControl<boolean | null>(
      initial?.isFromPOMatching ?? null
    ),
  });
}
