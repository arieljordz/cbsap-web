import { BasePaginationQuery } from '@core/model/dynamic-grid/grid.config';

/**dto OBJECTS */
export interface InvoiceRoutingFlowDto {
  invRoutingFlowID: number;
  entityProfileID: number;
  invRoutingFlowName: string;
  supplierInfoID: number;
  isActive: boolean;
  matchReference: string;
  invRoutingFlowLevels: RoutingFlowLevelsDto[] | [];
}
export interface RoutingFlowLevelsDto {
  invRoutingFlowLevelID: number;
  invRoutingFlowID: number;
  level: number;
  roleID: number;
}

/** SEARCH QUERY */
export interface SearchInvRoutingFlowByUserQuery extends BasePaginationQuery {
  invRoutingFlowID: number;
}
export interface SearchInvRoutingFlowByRolesQuery extends BasePaginationQuery {
  invRoutingFlowID: number;
}

export interface SearchInvRoutingFlowQuery extends BasePaginationQuery {
  EntityName: string;
  InvRoutingFlowName: string;
  LinkSupplier: string;
  Roles: string;
  MatchReference: string;
}

export interface InvRoutingFlowExportQuery {
  EntityName: string;
  InvRoutingFlowName: string;
  LinkSupplier: string;
  Roles: string;
  MatchReference: string;
}

export interface InvoiceRoutingFlowSelectTableDto {
  invRoutingFlowID: number;
  EntityName: string | null;
  InvRoutingFlowName: string | null;
  LinkSupplier: string | null;
  MatchReference: string | null;
}

export interface SearchInvRoutingFlowDto {
  invRoutingFlowID: number;
  entity: string | null;
  invoiceRoutingFlowName: string | null;
  suppliersLinked: string | null;
  matchReference: string | null;
}

export interface SearchInvRoutingFlowUserDto {
  userID: string | null;
}

export interface SearchInvRoutingFlowRolesDto {
  roleName: string[] | null;
}

export interface SearchInvRoutingModel {
  entityName: string;
  invRoutingFlowName: string;
  roles: string;
  supplier: string;
  matchReference: string;
}