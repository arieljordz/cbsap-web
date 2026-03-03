import {
  NgClass,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { YesnoPipe } from '@shared/pipes/yesno.pipe';

@Component({
  selector: 'app-select-table',
  standalone: true,
  imports: [
    PrimeImportsModule,
    FormsModule,
    NgIf,
    NgFor,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    YesnoPipe,
  ],
  templateUrl: './select-table.component.html',
  styleUrl: './select-table.component.scss',
})
export class SelectTableComponent implements OnInit, OnDestroy {
  columns: any[] = [];
  filters: { key: string; label: string; type?: string }[] = [];
  totalRecords: number = 0;
  multiple: boolean = false;
  onSearchCallback?: (filters: any) => void;
  selectBtnLabel = 'Select';
  rowDisablePredicate?: (row: any) => boolean;

  data: any[] = [];
  dataSub?: Subscription;
  data$?: BehaviorSubject<any[]>;

  totalRecordsSub?: Subscription;
  totalRecords$?: BehaviorSubject<number>;

  filterValues: { [key: string]: any } = {};
  selectedRows: any[] = [];
  pagination = {
    pageNumber: 0,
    pageSize: 5,
  };
  sortField?: string;
  sortOrder: number = 1;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    const d = this.config.data || {};
    this.multiple = d.multiple ?? false;
    this.onSearchCallback = d.onSearch;
    this.data$ = d.data$;
    this.totalRecords$ = d.totalRecords$;
    this.columns = d.columns || [];
    this.selectedRows = d.selectedRows || [];
    this.selectBtnLabel = d.selectBtnLabel || this.selectBtnLabel;
    this.rowDisablePredicate = d.rowDisablePredicate;
    this.filters = this.columns
      .filter((col) => col.isSearchFilter)
      .map((col) => ({
        key: col.field,
        label: col.header,
        type: col.filterType || col.type || 'text',
      }));

    if (this.totalRecords$) {
      this.totalRecordsSub = this.totalRecords$.subscribe((totalRecords) => {
        this.totalRecords = totalRecords;
      });
    } else {
      this.totalRecords = 0;
    }

    if (this.data$) {
      this.dataSub = this.data$.subscribe((rows) => {
        this.data = rows;
      });
    } else {
      this.data = d.data || []; // fallback to static data
    }
  }

  get selectionMode(): 'single' | 'multiple' {
    return this.multiple ? 'multiple' : 'single';
  }

  handleSearch(): void {
    this.pagination.pageNumber = 0;

    const filters = {
      ...this.filterValues,
      pageNumber: this.pagination.pageNumber + 1,
      pageSize: this.pagination.pageSize,
      ...(this.sortField && this.sortOrder != null
        ? {
            sortField: this.sortField,
            sortOrder: this.sortOrder,
          }
        : {}),
    };

    this.onSearchCallback?.(filters);
  }

  handleRowSelection(row: any): void {
    if (this.isRowDisabled(row?.data)) {
      return;
    }
    if (!this.multiple) {
      this.selectedRows = [row.data];
      this.ref.close(this.selectedRows);
    }
  }

  onSelectionChange(event: any[] | any): void {
    const normalized = Array.isArray(event)
      ? event
      : event
      ? [event]
      : [];
    this.selectedRows = normalized.filter((row) => !this.isRowDisabled(row));
  }

  confirmSelection(): void {
    this.ref.close(this.multiple ? this.selectedRows : this.selectedRows[0]);
  }

  cancel(): void {
    this.ref.close();
  }

  trackByFn(index: number, item: any): any {
    return item.field;
  }

  getColumnWidth(field: string): number {
    return 150;
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
    this.totalRecordsSub?.unsubscribe();
  }

  onLazyLoad(event: any): void {
    this.pagination.pageNumber = Math.floor(event.first / event.rows);
    this.pagination.pageSize = event.rows;

    this.sortField = event.sortField;
    this.sortOrder = event.sortOrder;

    const filters = {
      ...this.filterValues,
      pageNumber: this.pagination.pageNumber + 1,
      pageSize: this.pagination.pageSize,
      ...(this.sortField && this.sortOrder != null
        ? {
            sortField: this.sortField,
            sortOrder: this.sortOrder,
          }
        : {}),
    };

    this.onSearchCallback?.(filters);
  }

  isRowDisabled(row: any): boolean {
    return this.rowDisablePredicate ? this.rowDisablePredicate(row) : false;
  }
}
