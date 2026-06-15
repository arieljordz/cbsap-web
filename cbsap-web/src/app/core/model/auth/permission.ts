export type PermissionValues =
  | 'CanSubmitInvoice'
  | 'CanApproveInvTotalAmt'
  | 'CanApproverInvVariance'
  | 'CanDeleteInvoice'
  | 'CanManagePermission'
  | 'CanManageRole'
  | 'CanManageUser'
  | 'CanModifyEntity'
  | 'CanModifyInvAmt'
  | 'CanModifyInvCurrency'
  | 'CanModifyInvFlow'
  | 'CanModifyInvHeader'
  | 'CanModifyInvLine'
  | 'CanModifyInvTaxAmt'
  | 'CanModifyManualMatching';

export class Permission {
  public static readonly CanApproveInvoiceTotalAmount: PermissionValues =
    'CanApproveInvTotalAmt';
  public static readonly CanSubmitInvoice: PermissionValues =
    'CanSubmitInvoice';
  public static readonly CanModifyManualMatching: PermissionValues =
    'CanModifyManualMatching';
}
