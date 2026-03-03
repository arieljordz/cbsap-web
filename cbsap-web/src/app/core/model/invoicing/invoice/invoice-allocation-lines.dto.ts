export interface InvoiceAllocationDTO {
  LineNo: number;
  PurchaseOrderNo: string;
  PurchaseOrderLineNo: string;
  Account: string;
  LineDescription: string;
  Quantity: string;
}

export interface InvAllocationLineDto {
  invAllocLineID: number;
  invoiceID: number;
  lineNo: string;
  poNo: string;
  poLineNo: string;
  account: string;
  lineDescription: string;
  qty: number;
  lineNetAmount: number;
  lineTaxAmount: number;
  lineAmount: number;
  currency: string;
  taxCodeID: number;
  lineApproved: string;
  note: string;
  freeFields: FreeFieldDto[] | [];
  dimensions: LineDimensionDto[] | [];
}

export interface FreeFieldDto {
  key: string;
  value: string;
}
export interface LineDimensionDto {
  key: string;
  value: string;
}

export interface InvAllocEntryDto {
  invAllocLineID: number;
  invoiceID: number;
  lineNo: number | null;
  poNo: string | null;
  poLineNo: string | null;
  account: number | null;
  accountDisplay: string | null;
  qty: number;
  lineDescription: string | null;
  note: string | null;
  lineNetAmount: number;
  taxCodeID: number | null;
  lineTaxAmount: number;
  lineAmount: number;
  isFromPOMatching: boolean;
}
