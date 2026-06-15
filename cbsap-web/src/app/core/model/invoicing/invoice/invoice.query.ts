import { BasePaginationQuery } from '@core/model/dynamic-grid/grid.config';

export interface GetInvAllocLineQuery extends BasePaginationQuery {
  invoiceID: number;
}

export interface MyInvoiceSearchQuery extends BasePaginationQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
}
export interface ExportMyInvoiceQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
}

export interface MyInvoiceSearchModel {
  suppName?: string;
  invNo?: string;
  poNo?: string;
}

/**  Rejected Queue */
export interface RejectedSearchQuery extends BasePaginationQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
}

export interface ExportRejectedInvoiceQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
}
/** Exception Queue */
export interface ExceptionsSearchQuery extends BasePaginationQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
}

export interface ExportExceptionInvoiceQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
}
/** Archive Invoice */
export interface ArchiveSearchQuery extends BasePaginationQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
}

export interface ExportArchiveInvoiceQuery {
  SupplierName: string;
  InvoiceNo: string;
  PONo: string;
}
