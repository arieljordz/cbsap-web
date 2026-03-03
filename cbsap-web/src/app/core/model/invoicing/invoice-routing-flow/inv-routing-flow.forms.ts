import {
  InvoiceRoutingFlowDto,
  RoutingFlowLevelsDto,
} from '@core/model/invoicing/invoicing.index';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { minLengthArray } from '@core/utils/validators/MinLengthArrayValidator';

export type RoutingFlowLevelFormGroup = FormGroup<{
  invRoutingFlowLevelID: FormControl<number>;
  invRoutingFlowID: FormControl<number>;
  level: FormControl<number>;
  roleID: FormControl<number>;
  // roleName: FormControl<string | null>;
}>;

export type InvRoutingFlowGroup = FormGroup<{
  invRoutingFlowID: FormControl<number | null>;
  entityProfileID: FormControl<number | null>;
  invRoutingFlowName: FormControl<string | null>;
  supplierInfoID: FormControl<number | null>;
  isActive: FormControl<boolean | null>;
  matchReference: FormControl<string | null>;
  selectedRoleID: FormControl<number | null>;
  invRoutingFlowLevels: FormArray<RoutingFlowLevelFormGroup>;
}>;

export function createRoutingFlowLevelFormGroup(
  invRoutingFlowLevels?: Partial<RoutingFlowLevelsDto>
): RoutingFlowLevelFormGroup {
  return new FormGroup({
    invRoutingFlowLevelID: new FormControl(
      invRoutingFlowLevels?.invRoutingFlowLevelID ?? 0,
      { nonNullable: true }
    ),
    invRoutingFlowID: new FormControl(
      invRoutingFlowLevels?.invRoutingFlowID ?? 0,
      { nonNullable: true }
    ),
    level: new FormControl(invRoutingFlowLevels?.level ?? 0, {
      nonNullable: true,
    }),
    roleID: new FormControl(invRoutingFlowLevels?.roleID ?? 0, {
      nonNullable: true,
    }),
  });
}

export function createInvRoutingFlowForm(): InvRoutingFlowGroup {
  return new FormGroup({
    invRoutingFlowID: new FormControl<number | null>(0),
    entityProfileID: new FormControl<number | null>(null),
    invRoutingFlowName: new FormControl('', Validators.required),
    supplierInfoID: new FormControl<number | null>(null),
    isActive: new FormControl<boolean | null>(true),
    matchReference: new FormControl('', Validators.required),
    selectedRoleID: new FormControl<number | null>(0),
    invRoutingFlowLevels: new FormArray<RoutingFlowLevelFormGroup>(
      [],
      minLengthArray(1)
    ),
  });
}
