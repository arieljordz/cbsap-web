import { BasePaginationQuery } from '../dynamic-grid/grid.config';

export interface SearchGoodsReceiptQuery extends BasePaginationQuery {
  entity: string | null;
  supplier: string | null;
  goodsReceiptNumber: string | null;
  active: boolean | null;
  deliveryDateFrom: string | null;
  deliveryDateTo: string | null;
}

export interface ExportGoodsReceiptsQuery {
  entity: string | null;
  supplier: string | null;
  goodsReceiptNumber: string | null;
  active: boolean | null;
  deliveryDateFrom: string | null;
  deliveryDateTo: string | null;
}
