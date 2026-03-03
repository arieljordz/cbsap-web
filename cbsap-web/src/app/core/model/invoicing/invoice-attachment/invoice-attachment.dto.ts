export interface InvAttachmentDto {
    invoiceAttachnmentID: number;
    invoiceID: number;
    originalFileName: string | null;
    storageFileName: string | null;
    fileType: string | null;
}

export interface InvAttachmentFromDto {
    file: File;
    invoiceID: number;
}

export interface GetAllInvAttachmentDto {
    invoiceAttachnmentID: number;
    originalFileName: string | null;
    storageFileName: string | null;
}