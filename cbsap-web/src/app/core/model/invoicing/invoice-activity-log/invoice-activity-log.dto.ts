export interface InvActivityLogDto {
  actionName: string;
  invActivityLogEntries: InvActivityLogEntriesDto[];
}

export interface InvActivityLogEntriesDto {
  activityID: number;
  invoiceID: number;
  action: string | null;
  actionBy: string | null;
  activityClass: string | null;
  prevValue: string | null;
  newValue: string | null;
  table: string | null;
  columnName: string | null;
  metaDataOld: string | null;
  metaDataNew: string | null;
  metaData: string | null;
  actionDate: Date;
  actionedBy: string | null;
  createdDate: Date;
  lastUpdatedBy: string | null;
  lastUpdatedDate: Date | null;
  
  
  
}
