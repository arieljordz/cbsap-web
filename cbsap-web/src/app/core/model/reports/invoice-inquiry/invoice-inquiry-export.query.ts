import { InvoiceInquirySearchFilters } from "./invoice-inquiry.index";

export interface ExportInvoiceInquiryQuery {
  SupplierName?: string | null;
  InvoiceNumber?: string | null;
  PONumber?: string | null;
  Status?: number | null;
  ScanDateRange?: [Date, Date] | null;
  InvoiceDateRange?: [Date, Date] | null;

}