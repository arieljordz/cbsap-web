export enum InvoiceStatusEnum {
  Validation = 10,
  Exception = 50,
  ExceptionOnHold = 55,
  ForApproval = 60,
  ApprovalOnHold = 65,
  Rejected = 70,
  ReadyForExport = 80,
  Exported = 85,
  Approved = 90,
  Archived = 95,
}

export enum InvoiceQueue {
  ExceptionQueue = 101,
  RejectionQueue = 102,
  MyInvoices = 103,
  ArchiveQueue = 104,
  ExportedQueue = 105,
  ApproverQueue = 106,
  ReadyForExportQueue = 107,
}

export enum InvoiceActionButton {
  Approve = 'approve',
  Hold = 'hold',
  Reject = 'reject',
  RouteToException = 'routeToException',
  Reactivate = 'reactivate',
  Save = 'save',
  Validate = 'validate',
  Submit = 'submit',
  TakeLock = 'takelock',
  AddComment = 'addComment',
  AddAttachments = 'addAttachments',
  ActivityLog = 'activityLog',
  PurchaseOrder = 'purchaseOrder',
  Cancel = 'cancel',
}
