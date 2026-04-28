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
  SupplierInfoID?: number | null;
  InvoiceNumber?: string | null;
  PONumber?: string | null;
  Role?: string | null;
  Status: number[] | null;
  
  InvoiceDateFrom: Date | string | null;
  InvoiceDateTo: Date | string | null;

  InvoiceDueDateFrom: Date | string | null;
  InvoiceDueDateTo: Date | string | null;

  PaymentDateFrom: Date | string | null;
  PaymentDateTo: Date | string | null;

  ScanDateFrom: Date | string | null;
  ScanDateTo: Date | string | null;
}
