import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  Form,
} from '@angular/forms';

export type SupplierInfoFormGroup = FormGroup<{
  supplierInfoID: FormControl<number | null>;
  supplierID: FormControl<string | null>;
  supplierTaxID: FormControl<string | null>;
  entityProfileID: FormControl<number | null>;
  supplierName: FormControl<string | null>;
  isActive: FormControl<boolean | null>;

  telephone: FormControl<string | null>;
  emailAddress: FormControl<string | null>;
  contact: FormControl<string | null>;
  addressLine1: FormControl<string | null>;
  addressLine2: FormControl<string | null>;
  addressLine3: FormControl<string | null>;
  addressLine4: FormControl<string | null>;
  addressLine5: FormControl<string | null>;
  addressLine6: FormControl<string | null>;

  accountID: FormControl<number | null>;
  taxCodeID: FormControl<number | null>;
  currency: FormControl<string | null>;
  paymentTerms: FormControl<string | null>;
  invRoutingFlowID: FormControl<number | null>;

  freeField1: FormControl<string | null>;
  freeField2: FormControl<string | null>;
  freeField3: FormControl<string | null>;

  notes: FormControl<string | null>;
}>;

export function createSupplierInfoForm(): SupplierInfoFormGroup {
  return new FormGroup({
    supplierInfoID: new FormControl<number | null>(0),
    supplierID: new FormControl('', [Validators.required]),
    supplierTaxID: new FormControl(''),
    entityProfileID: new FormControl<number | null>(null),
    supplierName: new FormControl('',[Validators.required]),
    isActive: new FormControl<boolean | null>(true),

    telephone: new FormControl(''),
    emailAddress: new FormControl('', [Validators.email]),
    contact: new FormControl(''),
    addressLine1: new FormControl(''),
    addressLine2: new FormControl(''),
    addressLine3: new FormControl(''),
    addressLine4: new FormControl(''),
    addressLine5: new FormControl(''),
    addressLine6: new FormControl(''),

    accountID: new FormControl<number | null>(null),
    taxCodeID: new FormControl<number | null>(null),
    currency: new FormControl(''),
    paymentTerms: new FormControl(''),
    invRoutingFlowID: new FormControl<number | null>(null),

    freeField1: new FormControl(''),
    freeField2: new FormControl(''),
    freeField3: new FormControl(''),

    notes: new FormControl(''),
  });
}
