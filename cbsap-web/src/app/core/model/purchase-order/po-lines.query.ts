import { BasePaginationQuery } from '../dynamic-grid/grid.config';

export interface SearchPOLinesModel {
  suppName: string | null;
  suppABN: string | null;
  poNo: string | null;
  poDateFrom: Date | null;
  poDateTo: Date | null;
  supplierNo: string | null;
  isAvailableOrder: boolean;
  ExcludesMatchPOLineIds?: number[] | null;
}

export interface SearchPOLinesQuery {
  SupplierName: string | null;
  SupplierTaxID: string | null;
  PONo: string | null;
  PODateFrom?: string | null;
  PODateTo?: string | null;
  SupplierNo?: string | null;
  isAvailableOrder: boolean;
  ExcludesMatchPOLineIds?: number[] | null;

  //isAvailabeOrder : boolean;
}
