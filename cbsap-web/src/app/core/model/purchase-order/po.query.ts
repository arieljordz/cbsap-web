import { BasePaginationQuery } from '@core/model/dynamic-grid/grid.config';
export interface SearchPOModel {
  poNo: string | null;
  entityName: string | null;
  supplierName: string | null;
  isActive: boolean | null;
}

export interface POSearchQuery extends BasePaginationQuery {
  PONo?: string | null;
  EntityName?: string | null;
  Supplier?: string | null;
  IsActive?: boolean | null;
}

export interface ExportPOSearchQuery {
  PONo?: string | null;
  EntityName?: string | null;
  Supplier?: string | null;
  IsActive?: boolean | null;
}
