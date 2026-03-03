import { InvoiceQueue, InvoiceStatusEnum } from "@core/enums";

export interface InvValidationResponseDto {
    queueType: InvoiceQueue;
    invoiceActionType: string;
    failureMessages: string;
}