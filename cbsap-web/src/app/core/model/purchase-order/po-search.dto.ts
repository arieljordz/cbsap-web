export interface POSearchDto {
  purchaseOrderID: number;
  poNo: string | null;
  supplierID?: number | null;
  entityName: string | null;
  supplierName: string | null;
  supplierTaxID: string | null;
  currency: string | null;
  netAmount: number | null;
  isActive: boolean | null;
}

export interface ExportPoSearchDto {
  poNo: string | null;
  supplierID?: number | null;
  entityName: string | null;
  supplierName: string | null;
  supplierTaxID: string | null;
  currency: string | null;
  netAmount: number | null;
  active: string | null;
}
