import { TemplateRef } from '@angular/core';

export interface DynamicGridColumn {
  header: string;
  field: string;
  sort?: boolean;
  isSearchFilter: boolean;
  pipe?: string;
  type?:
    | 'text'
    | 'number'
    | 'date'
    | 'custom'
    | 'button'
    | 'actionButtons'
    | 'checkbox'
    | 'tag';
  filterType?: 'text' | 'number' | 'boolean'| "date-range";
  customTemplate?: TemplateRef<any>;
  buttonConfig?: {
    label: string;
    icon?: string;
    action: (item: any) => void;
    severity?: string;
  };
  wrap?: boolean;
}

export interface GridAction {
  label: string;
  icon?: string;
  action: (item: any) => void;
}
export interface RowGridAction {
  clickable?: (rowData: any) => void;
  allow?: boolean;
}

export interface GridConfig<T> {
  columns: DynamicGridColumn[];
  data: T[];
  totalRecords: number;
  pageSize?: number;
  pageNumber?: number;
  sortField?: string;
  sortOrder?: number; // 1 or -1
  actions?: GridAction[];
  loading?: boolean;
  rowClick?: RowGridAction[];
  rowDblClick?: RowGridAction[];
  gridKey?: string;
}

export interface BasePaginationQuery {
  PageNumber: number | 1;
  PageSize: number | 10;
  SortField?: string;
  SortOrder?: number | null;
}
