import { InvoiceStatusEnum } from "@core/enums/invoice.enum";

export interface InvoiceInquiryDto   {
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