export interface InvActivityLogDto {
  actionName: string;
  invActivityLogEntries: InvActivityLogEntriesDto[];
}

export interface InvActivityLogEntriesDto {
  activityLogID: number;
  invoiceID: number;
  previousStatus: string | null;
  currentStatus: string | null;
  reason: string | null;
  action: string | null;
  createdBy: string | null;
  createdDate: string | null;
}
