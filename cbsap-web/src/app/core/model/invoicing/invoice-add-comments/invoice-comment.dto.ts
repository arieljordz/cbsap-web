export interface InvoiceCommentDto {
    invoiceCommentID: number;
    comment: string | null;
    invoiceID: number;
}

export interface LoadInvoiceCommentsDto {
    invoiceCommentID: number;
    comment: string | null;
    createdBy: string;
    createdDate: string;
}

