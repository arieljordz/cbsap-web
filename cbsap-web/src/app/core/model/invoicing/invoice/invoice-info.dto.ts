import { InvoiceQueue, InvoiceStatusEnum } from '@core/enums';
import { SelectItem } from 'primeng/api';
import { InvAllocEntryDto } from './invoice-allocation-lines.dto';
import { InvInfoRoutingLevelDto } from './invoice-routing-level.dto';

export interface InvInfoDto {
  invID: number;
  invNo: string;
  invoiceDate: Date;
  mapID: string;
  scanDate: Date;
  entityProfileID: number;
  suppABN: string;
  suppName: string;
  supplierInfoID:number;
  suppBankAccount: string;
  dueDate: Date;
  poNo: string;
  grNo: string;
  currency: string;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  taxCodeID: number;
  paymentTerm: string;
  note: string;
  approverRole: string;
  queueType: InvoiceQueue;
  statusType: InvoiceStatusEnum;
  keywordID: number;
  keyword: string;
  routingFlowName: string;
  approvedUser: string;
  freeFields: FreeFieldDto[] | [];
  spareAmounts: SpareAmountDto[] | [];
}

export interface FreeFieldDto {
  invoiceFreeFieldID: number;
  invoiceID: number;
  fieldKey: string;
  fieldValue: string;
}
export interface SpareAmountDto {
  invoiceSpareAmountID: number;
  invoiceID: number;
  fieldKey: string;
  fieldValue: string;
}

export interface InvInfoDropdownDto {
  currencies: SelectItem[];
  paymentTerms: SelectItem[];
}

export interface InvoiceDto {
  invoiceID: number;
  invoiceNo: string;
  invoiceDate: Date;
  mapID: string;
  scanDate: Date;
  entityProfileID: number;
  supplierInfoID: number;
  supplierNo: string;
  suppABN: string;
  suppName: string;
  suppBankAccount: string;
  dueDate: Date;
  poNo: string;
  grNo: string;
  currency: string;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  taxCodeID: number;
  paymentTerm: string;
  note: string;
  approverRole: string;
  approvedUser: string;
  queueType: InvoiceQueue;
  statusType: InvoiceStatusEnum;
  keywordID: number;
  keyword: string;
  freeFields: FreeFieldDto[];
  spareAmount: SpareAmountDto[];
  invoiceAllocationLines: InvAllocEntryDto[];
  invInfoRoutingLevels: InvInfoRoutingLevelDto[];
}

export interface InvMyInvoiceSearchDto {
  invoiceID: number;
  entity: string | null;
  suppName: string | null;
  invoiceDate: string | null;
  invoiceNo: string | null;
  poNo: string | null;
  dueDate: string | null;
  grossAmount: number | null;

  nextRole: string | null;
  exceptionReason: string | null;
  isSelected: boolean;
}

export interface ExportMyInvoiceDto {
  entity?: string;
  suppName?: string;
  invoiceDate?: string;
  invoiceNo?: string;
  poNo?: string;
  dueDate?: string;
  grossAmount?: number;

  nextRole?: string;
}

/**Rejected Queue */
export interface RejectedInvoiceSearchDto {
  invoiceID: number;
  entity: string | null;
  suppName: string | null;
  invoiceDate: string | null;
  invoiceNo: string | null;
  poNo: string | null;
  dueDate: string | null;
  grossAmount: number | null;

  invoiceApprover: string | null;
  archiveDate: string | null;
}

/**Exception Queue */

export interface ExceptionInvoiceSearchDto {
  invoiceID: number;
  entity: string | null;
  suppName: string | null;
  invoiceDate: string | null;
  invoiceNo: string | null;
  poNo: string | null;
  dueDate: string | null;
  grossAmount: number | null;

  exceptionReason: string | null;
  isSelected: boolean;
}
/**Exception Queue */

export interface ArchiveInvoiceSearchDto {
  invoiceID: number;
  entity: string | null;
  suppName: string | null;
  invoiceDate: string | null;
  invoiceNo: string | null;
  poNo: string | null;
  dueDate: string | null;
  grossAmount: number | null;

  exceptionReason: string | null;
  isSelected: boolean;
}

export interface InvStatusChangeDto {
  invoiceID: number;
  status: InvoiceStatusEnum | null;
  reason: string | null;
}

export interface GetInvoiceStatusDto {
  status: InvoiceStatusEnum | null;
  queue: InvoiceQueue | null;
}

export interface AmountDto {
  netAmount?: number;
  taxAmount: number;
  totalAmount: number;
}
