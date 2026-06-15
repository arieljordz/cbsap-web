import {  EntityMatchingConfigDto } from '../entity.index';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

export type MatchingConfigFormGroup = FormGroup<{
    matchingConfigID: FormControl<number>;
    entityProfileID: FormControl<number>;
    configType: FormControl<'PO' | 'GR'>;
    matchingLevel: FormControl<string | null>;
    invoiceMatchBasis: FormControl<string | null>;
    dollarAmt: FormControl<number | null>;
    percentageAmt: FormControl<number | null>;
    
  }>;



export type EntityProfileFormGroup = FormGroup<{
  entityProfileID: FormControl<number | null>;
  entityName: FormControl<string | null>;
  entityCode: FormControl<string | null>;
  emailAddress: FormControl<string| null>;
  taxID: FormControl<string | null>;
  erpFinanceSystem: FormControl<string| null>;
  defaultInvoiceDueInDays: FormControl<number | null>;
  invAllowPresetAmount: FormControl<boolean | null >;
  invAllowPresetDimension: FormControl<boolean | null>;
  taxDollarAmt: FormControl<number | null>;
  taxPercentageAmt: FormControl<number | null>;
  createdDate: FormControl<Date | null>;
  matchingConfigs: FormArray<MatchingConfigFormGroup>;
}>;


export function createMatchingConfigGroup(config?: Partial<EntityMatchingConfigDto>): MatchingConfigFormGroup {
    return new FormGroup({
      matchingConfigID: new FormControl(config?.matchingConfigID ?? 0, { nonNullable: true }),
      entityProfileID: new FormControl(config?.entityProfileID ?? 0, { nonNullable: true }),
      configType: new FormControl(config?.configType ?? 'PO', {nonNullable: true,}),
      matchingLevel: new FormControl(config?.matchingLevel ?? '',),
      invoiceMatchBasis: new FormControl(config?.invoiceMatchBasis ?? '', ),
      dollarAmt: new FormControl(config?.dollarAmt ?? null, [ ]),
      percentageAmt: new FormControl(config?.percentageAmt ?? null, [ ])
    });
  }
  
  export function createEntityProfileForm(): EntityProfileFormGroup {
    return new FormGroup({
      entityProfileID: new FormControl<number | null>(0),
      entityName: new FormControl('', Validators.required),
      entityCode: new FormControl('', Validators.required),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      taxID: new FormControl('', Validators.required),
      erpFinanceSystem: new FormControl(''),
      defaultInvoiceDueInDays: new FormControl(1, [ Validators.required,
        Validators.min(1)]), 
      invAllowPresetAmount: new FormControl<boolean | null >(null),
      invAllowPresetDimension: new FormControl<boolean | null >(null),
      taxDollarAmt: new FormControl<number | null >(null),
      taxPercentageAmt: new FormControl<number | null >(null),
      createdDate: new FormControl<Date | null>(null),
      matchingConfigs: new FormArray<MatchingConfigFormGroup>([])
    });
  }

