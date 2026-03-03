export interface SearchRolePaginationParamQuery {
  Entity?: string | null;
  RoleName?: string | null;
  IsActive?: boolean | null;
  PageNumber: number | 1;
  PageSize: number | 10;
  SortField?: string;
  SortOrder?: number | null;
}
