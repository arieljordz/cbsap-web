import { BasePaginationQuery } from '../dynamic-grid/grid.config';

export interface SearchAccountLookUpQuery extends BasePaginationQuery {
  accountID: number | null;
  accountName: string | null;
  entityName: string | null;
  active: boolean | null;
}

export interface ExportAccountsQuery {
  accountID: number | null;
  accountName: string | null;
  entityName: string | null;
  active: boolean | null;
}
