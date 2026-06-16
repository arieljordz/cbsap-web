export interface AdvanceSearchDto {
 advanceSearchId? : number;
  supplierName: string;
  invoiceNo: string;
  pONo: string;
  paymentTerm?: string;
  supplierNo?: string
  suppABN? : string;
  suppBankAccount? : string;
  entityProfileID? : number;
  grNo? : string;
  dateRangeInvoiceDate? : string;
  startInvoiceDate? : string;
  endInvoiceDate? : string;
  dateRangeDueDate? : string;
  startDueDate? : string;
  endDueDate? : string;
  daystillDue? : number;
  netAmount? : number;
  taxCodeID? : number;
  taxAmount? : number;
  currency? : string;
  totalAmount? : number;
  invRoutingFlowName? : string;
  nextRole? : string;
  keyword? : string;
  mapID? : string;
  dateRangeScanDate? : string;
  startScanDate? : string;
  endScanDate? : string;
  invoiceID? : string;
  formName? : string;
}