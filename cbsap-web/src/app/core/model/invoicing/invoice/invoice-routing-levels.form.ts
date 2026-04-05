import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { InvInfoRoutingLevelDto } from './invoice-routing-level.dto';
import { FlowStatus } from '@core/enums/invoice.enum';

export type InvInfoRoutingLevelFormGroup = FormGroup<{
  invInfoRoutingLevelID: FormControl<number>;
  invRoutingFlowID: FormControl<number>;
  invoiceID: FormControl<number>;
  roleID: FormControl<number>;
  level: FormControl<number>;
  flowStatus: FormControl<FlowStatus>;
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
     flowStatus: new FormControl(invInfoRoutingLevels?.flowStatus ?? FlowStatus.Pending, {
      nonNullable: true,
    }),
  });
}

export function createInvInfoRoutingLevelForm(): InvInfoRoutingFlowFormGroup {
  return new FormGroup({
    invInfoRoutingLevels: new FormArray<InvInfoRoutingLevelFormGroup>([]),
  });
}
