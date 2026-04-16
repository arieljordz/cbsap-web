import { InvoiceInquirySearchFilters } from "./invoice-inquiry.index";

export interface SearchInvoiceInquiryQuery{
    invoiceInquirySearchDto: InvoiceInquirySearchFilters;
    PageNumber: number;
    PageSize: number;
    SortField?: string;
    SortOrder?: number | null;
}