import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { InvInfoRoutingLevelDto } from './invoice-routing-level.dto';

export type InvInfoRoutingLevelFormGroup = FormGroup<{
  invInfoRoutingLevelID: FormControl<number>;
  invRoutingFlowID: FormControl<number>;
  invoiceID: FormControl<number>;
  roleID: FormControl<number>;
  level: FormControl<number>;
}>;

export type InvInfoRoutingFlowFormGroup = FormGroup<{
  invInfoRoutingLevels: FormArray<InvInfoRoutingLevelFormGroup>;
}>;

export function createInvRoutingFlowLevelFormGroup(
  invInfoRoutingLevels?: Partial<InvInfoRoutingLevelDto>
): InvInfoRoutingLevelFormGroup {
  return new FormGroup({
    invInfoRoutingLevelID: new FormControl(
      invInfoRoutingLevels?.invInfoRoutingLevelID ?? 0,
      { nonNullable: true }
    ),
    invRoutingFlowID: new FormControl(
      invInfoRoutingLevels?.invRoutingFlowID ?? 0,
      { nonNullable: true }
    ),
    invoiceID: new FormControl(invInfoRoutingLevels?.invoiceID ?? 0, {
      nonNullable: true,
    }),
    roleID: new FormControl(invInfoRoutingLevels?.roleID ?? 0, {
      nonNullable: true,
    }),
    level: new FormControl(invInfoRoutingLevels?.level ?? 0, {
      nonNullable: true,
    }),
  });
}

export function createInvInfoRoutingLevelForm(): InvInfoRoutingFlowFormGroup {
  return new FormGroup({
    invInfoRoutingLevels: new FormArray<InvInfoRoutingLevelFormGroup>([]),
  });
}
