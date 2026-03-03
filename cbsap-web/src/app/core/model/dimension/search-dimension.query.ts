import { BasePaginationQuery } from '../dynamic-grid/grid.config';

export interface SearchDimensionQuery extends BasePaginationQuery {
  entity: string | null;
  dimension: string | null;
  dimensionName: string | null;
  active: boolean | null;
}

export interface ExportDimensionsQuery {
  entity: string | null;
  dimension: string | null;
  dimensionName: string | null;
  active: boolean | null;
}
