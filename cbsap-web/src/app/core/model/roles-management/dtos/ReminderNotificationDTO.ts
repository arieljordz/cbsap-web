export interface ReminderNotificationDTO {
    roleID: number;
    isNewInvoiceReceiveNotification: boolean;
    invoiceDueDateNotification: number | null;
    invoiceEscalateToLevel1ManagerNotification: number | null;
    forwardToLevel1Manager: number | null;
    forwardToLevel2Manager: number | null;
}