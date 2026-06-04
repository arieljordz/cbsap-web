import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { FreeFieldDto, SpareAmountDto } from './invoice-info.dto';

export type FreeFieldsFormGroup = FormGroup<{
  invoiceFreeFieldID: FormControl<number>;
  invoiceID: FormControl<number>;
  fieldKey: FormControl<string | null>;
  fieldValue: FormControl<string | null>;
}>;
export type SpareAmountFormGroup = FormGroup<{
  invoiceSpareAmountID: FormControl<number>;
  invoiceID: FormControl<number>;
  fieldKey: FormControl<string | null>;
  fieldValue: FormControl<string | null>;
}>;

export type InvInfoFormGroup = FormGroup<{
  invoiceID: FormControl<number | null>;
  invoiceNo: FormControl<string | null>;
  invoiceDate: FormControl<Date | null>;
  mapID: FormControl<string | null>;
  scanDate: FormControl<Date | null>;
  entityProfileID: FormControl<number | null>;
  supplierInfoID: FormControl<number | null>;
  suppABN: FormControl<string | null>;
  supplierNo: FormControl<string | null>;
  suppName: FormControl<string | null>;
  suppBankAccount: FormControl<string | null>;
  dueDate: FormControl<Date | null>;
  poNo: FormControl<string | null>;
  grNo: FormControl<string | null>;
  currency: FormControl<string | null>;
  netAmount: FormControl<number | null>;
  taxAmount: FormControl<number | null>;
  totalAmount: FormControl<number | null>;
  taxCodeID: FormControl<number | null>;
  paymentTerm: FormControl<string | null>;
  note: FormControl<string | null>;
  approverRole: FormControl<string | null>;
  approvedUser: FormControl<string | null>;
  keywordID: FormControl<number | null>;
  keyword: FormControl<string | null>;
  freeFields: FormArray<FreeFieldsFormGroup>;
  spareAmount: FormArray<SpareAmountFormGroup>;
}>;

export function createFreeFieldFormGroup(
  data?: Partial<FreeFieldDto>
): FreeFieldsFormGroup {
  return new FormGroup({
    invoiceFreeFieldID: new FormControl(data?.invoiceFreeFieldID ?? 0, {
      nonNullable: true,
    }),
    invoiceID: new FormControl(data?.invoiceID ?? 0, { nonNullable: true }),
    fieldKey: new FormControl<string | null>(data?.fieldKey ?? null),
    fieldValue: new FormControl<string | null>(data?.fieldValue ?? null),
  });
}
export function createSpareAmountFormGroup(
  data?: Partial<SpareAmountDto>
): SpareAmountFormGroup {
  return new FormGroup({
    invoiceSpareAmountID: new FormControl(data?.invoiceSpareAmountID ?? 0, {
      nonNullable: true,
    }),
    invoiceID: new FormControl(data?.invoiceID ?? 0, { nonNullable: true }),
    fieldKey: new FormControl<string | null>(data?.fieldKey ?? null),
    fieldValue: new FormControl<string | null>(data?.fieldValue ?? null),
  });
}

export function createInvInfoForm(): InvInfoFormGroup {
  return new FormGroup({
    invoiceID: new FormControl<number | null>({value:null, disabled:true}),
    invoiceNo: new FormControl<string | null>('', [Validators.required]),
    invoiceDate: new FormControl<Date | null>(null, [Validators.required]),
    mapID: new FormControl<string | null>({ value: null, disabled: true }),
    scanDate: new FormControl<Date | null>({ value: null, disabled: true }),
    entityProfileID: new FormControl<number | null>(null),
    supplierInfoID: new FormControl<number | null>(null),
    supplierNo: new FormControl<string | null>({value:'', disabled:true}),
    suppABN: new FormControl<string | null>({value:'', disabled:true}),
    suppName: new FormControl<string | null>('', [Validators.required]),
    suppBankAccount: new FormControl<string | null>(null),
    dueDate: new FormControl<Date | null>(null),
    poNo: new FormControl<string | null>(''),
    grNo: new FormControl<string | null>(''),
    currency: new FormControl<string | null>('', [Validators.required]),
    netAmount: new FormControl<number | null>(null, [Validators.required]),
    taxAmount: new FormControl<number | null>(null, [Validators.required]),
    totalAmount: new FormControl<number | null>(null, [Validators.required]),
    taxCodeID: new FormControl<number | null>(null, [Validators.required]),
    paymentTerm: new FormControl<string | null>(''),
    note: new FormControl<string | null>(null),
    approverRole: new FormControl<string | null>(''),
    approvedUser: new FormControl<string | null>(''),
    keywordID: new FormControl<number | null>(null),
    keyword: new FormControl<string | null>(null),
    freeFields: new FormArray<FreeFieldsFormGroup>([]),
    spareAmount: new FormArray<SpareAmountFormGroup>([]),
  });
}
