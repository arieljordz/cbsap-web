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
  public static readonly CanModifyInvoiceLine: PermissionValues =
    'CanModifyInvLine';  
  public static readonly CanManageUser: PermissionValues =
    'CanManageUser';
  public static readonly CanManageRole: PermissionValues =
    'CanManageRole';    
  public static readonly CanManagePermission: PermissionValues =
    'CanManagePermission';   
}
