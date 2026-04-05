import { FlowStatus } from "@core/enums";

export interface InvInfoRoutingLevelDto {
  invInfoRoutingLevelID: number;
  invRoutingFlowID: number;
  invoiceID: number;
  roleID: number;
  level: number;
  flowStatus:FlowStatus
}
