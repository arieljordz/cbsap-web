import { InvoiceInquirySearchFilters } from "./invoice-inquiry.index";

export interface ExportInvoiceInquiryQuery {

    SupplierName?: string | null;
    InvoiceNumber?: string | null;
    PONumber?: string |null;
   Role?: string | null;
   Status: number[] | null;

    InvoiceDateFrom: Date | string | null;
      InvoiceDateTo: Date | string | null;

     InvoiceDueDateFrom: Date | string | null;
      InvoiceDueDateTo: Date | string | null;

   PaymentDateFrom: Date | string | null;
   PaymentDateTo:  Date | string | null;

      ScanDateFrom: Date | string | null;
        ScanDateTo: Date | string | null;



}