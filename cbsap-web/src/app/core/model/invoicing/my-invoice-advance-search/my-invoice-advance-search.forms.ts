import { FormGroup, FormControl, FormArray, FormArrayName } from '@angular/forms';

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
  advanceSearchId : FormControl<number | null>;
  invoiceID: FormControl<string | null>;
  invoiceNo: FormControl<string | null>;
  invoiceDate: FormControl<Date | null>;
  startInvoiceDate : FormControl<Date | null>;
  endInvoiceDate : FormControl<Date | null>;
  dateRangeInvoiceDate : FormControl<Date[] | null>;
  mapID: FormControl<string | null>;
  scanDate: FormControl<Date | null>;
  startScanDate : FormControl<Date | null>;
  endScanDate : FormControl<Date | null>;
  dateRangeScanDate : FormControl<Date[] | null>;
  entityProfileID: FormControl<number | null>;
  supplierInfoID: FormControl<number | null>;
  suppABN: FormControl<string | null>;
  supplierNo: FormControl<string | null>;
  supplierName: FormControl<string | null>;
  suppBankAccount: FormControl<string | null>;
  dueDate: FormControl<Date | null>;
  startDueDate : FormControl<Date | null>;
  endDueDate : FormControl<Date | null>;
  dateRangeDueDate : FormControl<Date[] | null>;
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
  invRoutingFlowID: FormControl<number | null>;
  invRoutingFlowName: FormControl<string | null>;
  nextRole: FormControl<string | null>;
  daysTillDue: FormControl<number | null>;
  freeFields: FormArray<FreeFieldsFormGroup>;
  spareAmount: FormArray<SpareAmountFormGroup>;
  isSaveAsTemplate : FormControl<boolean | null>;
}>;

export function createInvInfoForm(): InvInfoFormGroup {
  return new FormGroup({
    advanceSearchId : new FormControl<number | null>(null),
    invoiceID: new FormControl<string | null>(''),
    invoiceNo: new FormControl<string | null>(''),
    invoiceDate: new FormControl<Date | null>(null),
    startInvoiceDate: new FormControl<Date | null>(null),
    endInvoiceDate: new FormControl<Date | null>(null),
    dateRangeInvoiceDate :  new FormControl<Date[] | null>(null),
    mapID: new FormControl<string | null>(null),
    scanDate: new FormControl<Date | null>(null),
    startScanDate: new FormControl<Date | null>(null),
    endScanDate: new FormControl<Date | null>(null),
    dateRangeScanDate :  new FormControl<Date[] | null>(null),
    entityProfileID: new FormControl<number | null>(null),
    supplierInfoID: new FormControl<number | null>(null),
    supplierNo: new FormControl<string | null>(''),
    suppABN: new FormControl<string | null>(''),
    supplierName: new FormControl<string | null>(''),
    suppBankAccount: new FormControl<string | null>(null),
    dueDate: new FormControl<Date | null>(null),
    startDueDate: new FormControl<Date | null>(null),
    endDueDate: new FormControl<Date | null>(null),
    dateRangeDueDate :  new FormControl<Date[] | null>(null),
    poNo: new FormControl<string | null>(''),
    grNo: new FormControl<string | null>(''),
    currency: new FormControl<string | null>(null),
    netAmount: new FormControl<number | null>(null),
    taxAmount: new FormControl<number | null>(null),
    totalAmount: new FormControl<number | null>(null),
    taxCodeID: new FormControl<number | null>(null),
    paymentTerm: new FormControl<string | null>(''),
    note: new FormControl<string | null>(null),
    approverRole: new FormControl<string | null>(''),
    approvedUser: new FormControl<string | null>(''),
    keywordID: new FormControl<number | null>(null),
    keyword: new FormControl<string | null>(null),
    daysTillDue: new FormControl<number | null>(null),
    nextRole: new FormControl<string | null>(null),
    invRoutingFlowID: new FormControl<number | null>(null),
    invRoutingFlowName: new FormControl<string | null>(null),
    freeFields: new FormArray<FreeFieldsFormGroup>([]),
    spareAmount: new FormArray<SpareAmountFormGroup>([]),
    isSaveAsTemplate : new FormControl<boolean | false>(false)
  });
}
