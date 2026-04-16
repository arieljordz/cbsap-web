import { InvoiceStatusEnum } from "@core/enums/invoice.enum";

export interface InvoiceInquirySearchDto {
  invoiceID: number;
  supplierName?: string;
  invoiceDate?: string;
  invoiceNumber?: string;
  poNumber?: string;
  dueDate?: string;
  grossAmount: string;
  nextRole?: string;
  exceptionReason?: string;
  status?: InvoiceStatusEnum | null;
}

export interface InvoiceInquirySearchFilters {
  SupplierName?: string | null;
  InvoiceNumber?: string | null;
  PONumber?: string | null;
  Status?: number | null;
  ScanDateRange?: [Date, Date] | null;
  InvoiceDateRange?: [Date, Date] | null;

}
