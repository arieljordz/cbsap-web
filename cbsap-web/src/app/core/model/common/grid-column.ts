import { TemplateRef } from '@angular/core';

export interface TableColumn {
  field: string;
  header: string;
  sort: boolean;
  sortField?: string; // Optional field for custom sort
  isSearchFilter: boolean;
  dataType?: string;
  customTemplate?: TemplateRef<any>;
  editable?: boolean;
}
