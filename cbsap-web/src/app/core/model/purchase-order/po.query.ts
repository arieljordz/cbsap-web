import { BasePaginationQuery } from '@core/model/dynamic-grid/grid.config';
export interface SearchPOModel {
  poNo: string;
  entityName: string;
  supplierName: string;
  isActive: null;
  goodReceipt : string;
}

export interface POSearchQuery extends BasePaginationQuery {
  PONo?: string | null;
  EntityName?: string | null;
  SupplierName?: string | null;
  IsActive?: boolean | null;
  TotalPage? : number | null;
  GoodReceipt? : string | null;
}

export interface ExportPOSearchQuery {
  PONo?: string | null;
  EntityName?: string | null;
  SupplierName?: string | null;
  IsActive?: boolean | null;
  GoodReceipt? : string | null;
}

export interface PurchaseOrderListSearchQuery extends BasePaginationQuery {
  PurchaseOrderId?: number | null;
}
