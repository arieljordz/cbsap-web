import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import {
  CustomButton,
  SearchField,
} from '@core/model/quick-search/QuickSearchModel';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { TableColumn } from '@core/model/common/grid-column';
import { getStatusFilterOptions } from '@core/constants/common/statusFilterOptions';
import { AlertService, ExcelService, LookUpsService } from '@core/services';
import { MessageSeverity } from '@core/constants';
import { YesnoPipe } from '@shared/pipes/yesno.pipe';
import { SearchDimensionLookupDto } from '@core/model/dimension/search-dimension.dto';
import {
  ExportDimensionsQuery,
  SearchDimensionQuery,
} from '@core/model/dimension/search-dimension.query';
import { Pagination, ResponseResult } from '@core/model/common';
import { TableLazyLoadEvent } from 'primeng/table';

interface DimensionSearchModel {
  entity: string;
  dimension: string;
  dimensionName: string;
  active: boolean | null;
}

interface DimensionGridItem {
  entity: string;
  dimension: string;
  dimensionName: string;
  active: boolean;
}

@Component({
  selector: 'app-dimension',
  standalone: true,
  imports: [
    PrimeImportsModule,
    QuickSearchComponent,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    YesnoPipe,
  ],
  templateUrl: './dimension.component.html',
  styleUrls: ['./dimension.component.scss'],
})
export class DimensionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly sortFieldMap: Record<string, string> = {
    entity: 'entity',
    dimension: 'dimension',
    dimensionName: 'dimensionName',
    active: 'active',
  };

  constructor(
    private lookUpsService: LookUpsService,
    private excelService: ExcelService,
    private alertService: AlertService
  ) {}

  dimensionSearchModel: DimensionSearchModel = {
    entity: '',
    dimension: '',
    dimensionName: '',
    active: null,
  };

  dimensionSearchFields: SearchField<DimensionSearchModel>[] = [
    {
      key: 'entity',
      label: 'Entity',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'dimension',
      label: 'Dimension',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'dimensionName',
      label: 'Dimension Name',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'active',
      label: 'Active Status',
      type: 'bool',
      fieldType: 'dropdown',
      options: getStatusFilterOptions(),
    },
  ];

  searchActionButtonsConfig: {
    search?: boolean;
    clear?: boolean;
    export?: boolean;
    custom?: CustomButton[];
  } = {
    search: true,
    clear: true,
    export: true,
    custom: [
      {
        label: 'Adv Search',
        icon: 'pi pi-search',
        severity: 'secondary',
        action: () => this.onAdvancedSearch(),
      },
    ],
  };

  columns: TableColumn[] = [
    { field: 'entity', header: 'Entity', sort: true, isSearchFilter: false },
    { field: 'dimension', header: 'Dimension', sort: true, isSearchFilter: false },
    { field: 'dimensionName', header: 'Dimension Name', sort: true, isSearchFilter: false },
    {
      field: 'active',
      header: 'Active Status',
      sort: true,
      isSearchFilter: false,
      dataType: 'tag',
    },
  ];

  dimensions: DimensionGridItem[] = [];

  totalRecords = 0;
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortOrder = 1;
  triggeredBySearch = false;
  loading = false;

  @ViewChild('dtDimensions') table: Table | undefined;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(filters: DimensionSearchModel): void {
    this.dimensionSearchModel = {
      entity: filters?.entity ?? '',
      dimension: filters?.dimension ?? '',
      dimensionName: filters?.dimensionName ?? '',
      active: filters?.active ?? null,
    };

    this.triggeredBySearch = true;
    this.pageNumber = 1;
    this.loadDimensions();
  }

  onClear(): void {
    this.dimensionSearchModel = {
      entity: '',
      dimension: '',
      dimensionName: '',
      active: null,
    };

    this.triggeredBySearch = true;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.table?.reset();
    this.loadDimensions();
  }

  onExport(): void {
    if (this.totalRecords === 0) {
      this.alertService.showToast(
        MessageSeverity.warn,
        'Warning',
        'Please hit search button before exporting data.'
      );
      return;
    }

    const exportQuery = this.buildExportQuery();
    this.loading = true;

    this.lookUpsService
      .exportDimensions(exportQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: ResponseResult<Blob>) => {
          if (result.isSuccess && result.responseData) {
            const fileName = this.excelService.excelFileName('Dimensions');
            this.excelService.saveFile(result.responseData, fileName);
          } else {
            this.alertService.showToast(
              MessageSeverity.warn,
              'Export',
              'No data available to export.'
            );
          }
          this.loading = false;
        },
        error: () => {
          this.alertService.showToast(
            MessageSeverity.error,
            'Export Failed',
            'Unable to export dimensions at this time.'
          );
          this.loading = false;
        },
      });
  }

  onAdvancedSearch(): void {
    // TODO: wire advanced search modal or navigation.
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    if (this.triggeredBySearch) {
      this.triggeredBySearch = false;
      return;
    }

    this.sortField = event.sortField ? String(event.sortField) : '';
    this.sortOrder = event.sortOrder ? event.sortOrder : 1;
    this.loading = true;
    this.pageNumber = event.first !== undefined && event.rows
      ? Math.floor(event.first / event.rows) + 1
      : 1;
    this.pageSize = event.rows ?? this.pageSize;
    this.loadDimensions();
  }

  private loadDimensions(): void {
    const query = this.buildSearchQuery();
    this.loading = true;

    this.lookUpsService
      .dimensionSearchLookUp(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: ResponseResult<Pagination<SearchDimensionLookupDto>>) => {
          if (result.isSuccess && result.responseData) {
            this.dimensions = (result.responseData.data ?? []).map((item) =>
              this.mapDimensionToGridItem(item)
            );
            this.totalRecords = result.responseData.totalCount;
          } else {
            this.dimensions = [];
            this.totalRecords = 0;
          }

          this.loading = false;
          this.triggeredBySearch = false;
        },
        error: () => {
          this.dimensions = [];
          this.totalRecords = 0;
          this.loading = false;
          this.triggeredBySearch = false;
        },
      });
  }

  private buildSearchQuery(): SearchDimensionQuery {

    const sortField = this.mapSortField(this.sortField);

    const query: SearchDimensionQuery = {
      entity: this.dimensionSearchModel.entity?.trim() || null,
      dimension: this.dimensionSearchModel.dimension?.trim() || null,
      dimensionName: this.dimensionSearchModel.dimensionName?.trim() || null,
      active: this.dimensionSearchModel.active,
      PageNumber: this.pageNumber || 1,
      PageSize: this.pageSize,
      SortField: sortField,
      SortOrder: this.sortOrder,
    };

    if (!sortField) {
      delete query.SortField;
      delete query.SortOrder;
    }

    return query;
  }

  private mapSortField(field: string): string | undefined {
    if (!field) {
      return undefined;
    }

    return this.sortFieldMap[field] ?? field;
  }

  private buildExportQuery(): ExportDimensionsQuery {
    const searchQuery = this.buildSearchQuery();

    return {
      entity: searchQuery.entity,
      dimension: searchQuery.dimension,
      dimensionName: searchQuery.dimensionName,
      active: searchQuery.active,
    };
  }

  private mapDimensionToGridItem(
    dimension: SearchDimensionLookupDto
  ): DimensionGridItem {
    return {
      entity: dimension.entity ?? '',
      dimension: dimension.dimension ?? '',
      dimensionName: dimension.dimensionName ?? '',
      active: this.toBoolean(dimension.active),
    };
  }

  private toBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.toLowerCase();
      return ['yes', 'true', '1', 'y', 't'].includes(normalized);
    }

    if (typeof value === 'number') {
      return value !== 0;
    }

    return false;
  }
}
