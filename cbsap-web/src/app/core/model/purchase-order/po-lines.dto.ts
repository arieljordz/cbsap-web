import { POMatchingStatus } from '@core/enums/po-matching.enum';

export interface PoLinesDto {
  purchaseOrderLineID: number;
  purchaseOrderID: number;
  purchaseOrderMatchTrackingID: number | null;
  invoiceID: number | null;
  invAllocLineID: number | null;
  poNo: string | null;
  lineNo: number | null;
  description: string | null;
  accountID: number | null;
  accountName: string | null;
  qty: number;
  price: number | null;
  netAmount: number | null;
  taxAmount: number | null;
  amount: number | null;
  status: POMatchingStatus | null;
  baseRemainingQty: number | 0;
  remainingQty: number | 0;
  originalQty: number | 0;
  totalMatchedQty: number | 0;
  basedQty: number | 0;
  isForEditPOMatching: boolean;
  storedRemainingQty: number | 0;
  totalMatchedQtyUI: number | 0;
  mergeQty: number | 0;
}
export interface SearchPoLinesDto {
  poLines: PoLinesDto[] | null;
}
export interface SavePOMatchingDto {
  invoiceID: number;
  poLines: PoLinesDto[] | null;
}
export interface SearchPOResult {
  polines: (PoLinesDto | null)[] | undefined;
  isAvailableOrder: boolean;
}
