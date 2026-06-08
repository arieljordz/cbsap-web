import { BasePaginationQuery } from '@core/model/dynamic-grid/grid.config';

export interface GetInvAllocLineQuery extends BasePaginationQuery {
  invoiceID: number;
}

export interface MyInvoiceSearchQuery extends BasePaginationQuery {
  AdvanceSearchId? : number;
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
  PaymentTerm?: string;
  SupplierNo?: string
  SuppABN? : string;
  SuppBankAccount? : string;
  EntityProfileID? : number;
  GrNo? : string;
  DateRangeInvoiceDate? : Date[];
  StartInvoiceDate? : string;
  EndInvoiceDate? : string;
  DateRangeDueDate? :  Date[];
  StartDueDate? : string;
  EndDueDate? : string;
  DaystillDue? : number;
  NetAmount? : number;
  TaxCodeID? : number;
  TaxAmount? : number;
  Currency? : string;
  TotalAmount? : number;
  InvRoutingFlowName? : string;
  NextRole? : string;
  Keyword? : string;
  MapID? : string;
  DateRangeScanDate? :  Date[];
  StartScanDate? : string;
  EndScanDate? : string;
  InvoiceID? : string;
  FormName? : string;
}

export interface ExportMyInvoiceQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
  PaymentTerm?: string;
  SupplierNo?: string
  SuppABN? : string;
  SuppBankAccount? : string;
  EntityProfileID? : number;
  GrNo? : string;
  DateRangeInvoiceDate? : Date[];
  StartInvoiceDate? : string;
  EndInvoiceDate? : string;
  DateRangeDueDate? :  Date[];
  StartDueDate? : string;
  EndDueDate? : string;
  DaystillDue? : number;
  NetAmount? : number;
  TaxCodeID? : number;
  TaxAmount? : number;
  Currency? : string;
  TotalAmount? : number;
  InvRoutingFlowName? : string;
  NextRole? : string;
  Keyword? : string;
  MapID? : string;
  DateRangeScanDate? :  Date[];
  StartScanDate? : string;
  EndScanDate? : string;
  InvoiceID? : string;
  FormName? : string;
}

export interface MyInvoiceSearchModel {
  suppName?: string;
  invNo?: string;
  poNo?: string;
  PaymentTerm?: string;
  SupplierNo?: string
  SuppABN? : string;
  SuppBankAccount? : string;
  EntityProfileID? : number;
  GrNo? : string;
  DateRangeInvoiceDate? : Date[];
  StartInvoiceDate? : string;
  EndInvoiceDate? : string;
  DateRangeDueDate? :  Date[];
  StartDueDate? : string;
  EndDueDate? : string;
  DaystillDue? : number;
  NetAmount? : number;
  TaxCodeID? : number;
  TaxAmount? : number;
  Currency? : string;
  TotalAmount? : number;
  InvRoutingFlowName? : string;
  NextRole? : string;
  Keyword? : string;
  MapID? : string;
  DateRangeScanDate? :  Date[];
  StartScanDate? : string;
  EndScanDate? : string;
  InvoiceID? : string; 
}

/**  Rejected Queue */
export interface RejectedSearchQuery extends BasePaginationQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
  PaymentTerm?: string;
  SupplierNo?: string
  SuppABN? : string;
  SuppBankAccount? : string;
  EntityProfileID? : number;
  GrNo? : string;
  DateRangeInvoiceDate? : Date[];
  StartInvoiceDate? : string;
  EndInvoiceDate? : string;
  DateRangeDueDate? :  Date[];
  StartDueDate? : string;
  EndDueDate? : string;
  DaystillDue? : number;
  NetAmount? : number;
  TaxCodeID? : number;
  TaxAmount? : number;
  Currency? : string;
  TotalAmount? : number;
  InvRoutingFlowName? : string;
  NextRole? : string;
  Keyword? : string;
  MapID? : string;
  DateRangeScanDate? :  Date[];
  StartScanDate? : string;
  EndScanDate? : string;
  InvoiceID? : string; 
}

export interface ExportRejectedInvoiceQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string; 
  PaymentTerm?: string;
  SupplierNo?: string
  SuppABN? : string;
  SuppBankAccount? : string;
  EntityProfileID? : number;
  GrNo? : string;
  DateRangeInvoiceDate? : Date[];
  StartInvoiceDate? : string;
  EndInvoiceDate? : string;
  DateRangeDueDate? :  Date[];
  StartDueDate? : string;
  EndDueDate? : string;
  DaystillDue? : number;
  NetAmount? : number;
  TaxCodeID? : number;
  TaxAmount? : number;
  Currency? : string;
  TotalAmount? : number;
  InvRoutingFlowName? : string;
  NextRole? : string;
  Keyword? : string;
  MapID? : string;
  DateRangeScanDate? :  Date[];
  StartScanDate? : string;
  EndScanDate? : string;
  InvoiceID? : string;
  FormName? : string;
}
/** Exception Queue */
export interface ExceptionsSearchQuery extends BasePaginationQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
  PaymentTerm?: string;
  SupplierNo?: string
  SuppABN? : string;
  SuppBankAccount? : string;
  EntityProfileID? : number;
  GrNo? : string;
  DateRangeInvoiceDate? : Date[];
  StartInvoiceDate? : string;
  EndInvoiceDate? : string;
  DateRangeDueDate? :  Date[];
  StartDueDate? : string;
  EndDueDate? : string;
  DaystillDue? : number;
  NetAmount? : number;
  TaxCodeID? : number;
  TaxAmount? : number;
  Currency? : string;
  TotalAmount? : number;
  InvRoutingFlowName? : string;
  NextRole? : string;
  Keyword? : string;
  MapID? : string;
  DateRangeScanDate? :  Date[];
  StartScanDate? : string;
  EndScanDate? : string;
  InvoiceID? : string; 
}

export interface ExportExceptionInvoiceQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
  PaymentTerm?: string;
  SupplierNo?: string
  SuppABN? : string;
  SuppBankAccount? : string;
  EntityProfileID? : number;
  GrNo? : string;
  DateRangeInvoiceDate? : Date[];
  StartInvoiceDate? : string;
  EndInvoiceDate? : string;
  DateRangeDueDate? :  Date[];
  StartDueDate? : string;
  EndDueDate? : string;
  DaystillDue? : number;
  NetAmount? : number;
  TaxCodeID? : number;
  TaxAmount? : number;
  Currency? : string;
  TotalAmount? : number;
  InvRoutingFlowName? : string;
  NextRole? : string;
  Keyword? : string;
  MapID? : string;
  DateRangeScanDate? :  Date[];
  StartScanDate? : string;
  EndScanDate? : string;
  InvoiceID? : string;
  FormName? : string;
}
/** Archive Invoice */
export interface ArchiveSearchQuery extends BasePaginationQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
  PaymentTerm?: string;
  SupplierNo?: string
  SuppABN? : string;
  SuppBankAccount? : string;
  EntityProfileID? : number;
  GrNo? : string;
  DateRangeInvoiceDate? : Date[];
  StartInvoiceDate? : string;
  EndInvoiceDate? : string;
  DateRangeDueDate? :  Date[];
  StartDueDate? : string;
  EndDueDate? : string;
  DaystillDue? : number;
  NetAmount? : number;
  TaxCodeID? : number;
  TaxAmount? : number;
  Currency? : string;
  TotalAmount? : number;
  InvRoutingFlowName? : string;
  NextRole? : string;
  Keyword? : string;
  MapID? : string;
  DateRangeScanDate? :  Date[];
  StartScanDate? : string;
  EndScanDate? : string;
  InvoiceID? : string; 
}

export interface ExportArchiveInvoiceQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
  PaymentTerm?: string;
  SupplierNo?: string
  SuppABN? : string;
  SuppBankAccount? : string;
  EntityProfileID? : number;
  GrNo? : string;
  DateRangeInvoiceDate? : Date[];
  StartInvoiceDate? : string;
  EndInvoiceDate? : string;
  DateRangeDueDate? :  Date[];
  StartDueDate? : string;
  EndDueDate? : string;
  DaystillDue? : number;
  NetAmount? : number;
  TaxCodeID? : number;
  TaxAmount? : number;
  Currency? : string;
  TotalAmount? : number;
  InvRoutingFlowName? : string;
  NextRole? : string;
  Keyword? : string;
  MapID? : string;
  DateRangeScanDate? :  Date[];
  StartScanDate? : string;
  EndScanDate? : string;
  InvoiceID? : string;
  FormName? : string;
}
