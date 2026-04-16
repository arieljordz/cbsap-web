import { InvoiceInquirySearchFilters } from "./invoice-inquiry.index";

export interface ExportInvoiceInquiryQuery {
  SupplierName?: string | null;
  InvoiceNumber?: string | null;
  PONumber?: string | null;
  Status?: number | null;
  ScanDateFrom?: string | Date | null;
  ScanDateTo?: string | Date | null;
  InvoiceDateFrom?: string | Date | null;
  InvoiceDateTo?: string | Date | null;
}