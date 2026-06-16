import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageSeverity } from '@core/constants';
import { Pagination, ResponseResult } from '@core/model/common';
import { TableColumn } from '@core/model/common/grid-column';
import { SearchField } from '@core/model/quick-search/QuickSearchModel';
import { ExportEntityQuery } from '@core/model/system-settings/entity/entity-export.query';
import {
  EntitySearchDto,
  EntitySearchFilters,
  SearchEntityQuery,
} from '@core/model/system-settings/entity/entity.index';
import {
  AlertService,
  EntityService,
  ExcelService,
  GridService,
} from '@core/services';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-entity-search',
  standalone: true,
  providers: [AlertService, DatePipe, ConfirmationService],
  imports: [FormsModule, PrimeImportsModule, NgClass, NgFor, NgIf, QuickSearchComponent],
  templateUrl: './entity-search.component.html',
  styleUrl: './entity-search.component.scss',
})
export class EntitySearchComponent implements OnInit {
  @ViewChild('dtSearchEntityPagination') table: Table | undefined;
  private destroySubject: Subject<void> = new Subject();

  entitySearchFilters: EntitySearchFilters = {
    EntityName: '',
    EntityCode: '',
  };

  entitypagination: EntitySearchDto[] = [];
  columns: TableColumn[] = [];
  sizes: any;

  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  sortField?: string;
  sortOrder: number = 1;

  searchActionButtonsConfig = {
    search: true,
    clear: true,
    export: true,
  };

  entityFields: SearchField<EntitySearchFilters>[] = [
    {
      key: 'EntityName',
      label: 'Entity Name',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'EntityCode',
      label: 'Entity Code',
      type: 'text',
      fieldType: 'input',
    },
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private gridService: GridService,
    private entityService: EntityService,
    private message: AlertService,
    private excelService: ExcelService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('entity-search');
    if (stored) {
      this.entitySearchFilters = JSON.parse(stored);
    }

    this.columns = this.gridService.entityGridColumn();
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
  }
  /** Action Functionality */
  addEntity() {
    this.router.navigate(['entity-profile-management/add-entity']);
  }

  /**search pagination */
  search(filters: EntitySearchFilters) {
    this.entitySearchFilters = filters;
    this.searchEntity();
  }

  clear() {
    localStorage.removeItem('entity-search');
    localStorage.removeItem('entity-grid');
    this.entitySearchFilters = {
      EntityName: '',
      EntityCode: '',
    };
    this.pageNumber = 0;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.table?.reset();
    this.searchEntity();
  }

  deleteConfirmation(rowData: any) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete entity : ' + rowData.entityName + '?',
      header: 'Confirm Deletion',
      accept: () => {
        this.deleteEntity(rowData.entityProfileID);
      },
    });
  }
  private deleteEntity(entityProfileID: number) {
    this.entityService.deleteEntity(entityProfileID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Entity Deletion',
            'Your  Entity has been successfully deleted',
            2000
          );
          this.searchEntity();
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on Entity Deletion',
          error.messages?.[0],
          2000
        );
      },
    });
  }

  searchEntity() {

    let searchEntityQuery: SearchEntityQuery = {
      EntityName: this.entitySearchFilters.EntityName,
      EntityCode: this.entitySearchFilters.EntityCode,
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      SortField: this.sortField,
      SortOrder: this.sortOrder,
    };

    if (this.sortField == null) {
      delete searchEntityQuery.SortField;
    }
    if (this.entitySearchFilters.EntityCode == null) {
      delete searchEntityQuery.EntityCode;
    }
    if (this.entitySearchFilters.EntityName == null) {
      delete searchEntityQuery.EntityName;
    }

    this.entityService
      .searchEntity(searchEntityQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Pagination<EntitySearchDto>>) => {
          if (result.isSuccess) {
            if (result.responseData?.data) {
              this.entitypagination = result.responseData?.data;
              this.totalRecords = result.responseData?.totalCount;
            }
            this.loading = false;
          }
        },
        error: (error) => this.onError(error),
      });
  }

  editEntity(entity: any): void {
    const id = entity.entityProfileID;
    localStorage.setItem('entity-search', JSON.stringify(this.entitySearchFilters));
    this.router.navigate(['entity-profile-management/edit-entity', id]);
  }

  onPageChange(event: any) {
    this.pageNumber = event.first + 1; //page starts from 0, so incrementing by 1
    this.pageSize = event.rows;
    this.searchEntity();
  }
  onLazyLoad(event: any): void {
    this.sortField = event.sortField ? event.sortField : null;
    this.sortOrder = event.sortOrder ? event.sortOrder : 1;
    this.loading = true;
    this.pageNumber = event.first / event.rows + 1; // Calculate page number for the API request
    this.pageSize = event.rows; // Update page size
    this.searchEntity();
  }

  onError(error: any) {}

  exportToExcel() {
    if (this.totalRecords === 0) {
      this.message.showToast(
        MessageSeverity.warn,
        'Warning ',
        'Please hit search button before exporting data'
      );
      return;
    }

    this.loading = true;

    let exportEntityQuery: ExportEntityQuery = {
      EntityCode: this.entitySearchFilters.EntityCode,
      EntityName: this.entitySearchFilters.EntityName,
    };

    if (!this.entitySearchFilters.EntityCode) {
      delete exportEntityQuery.EntityCode;
    }
    if (!this.entitySearchFilters.EntityName) {
      delete exportEntityQuery.EntityName;
    }

    this.entityService
      .exportEntity(exportEntityQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Blob>) => {
          if (result.isSuccess) {
            if (result.responseData) {
              const blob = result.responseData;
              this.excelService.saveFile(blob, this.getTimestampedFileName());
            } else {
            }
            this.loading = false;
          }
        },
        error: (error) => this.onError(error),
      });
  }

  getTimestampedFileName(): string {
    const timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    return `Entity_${timestamp}.xlsx`;
  }

  
}

