import { BasePaginationQuery } from '@core/model/dynamic-grid/grid.config';

export interface LoadInvoiceCommentQuery extends BasePaginationQuery {
  InvoiceID: number;
}
