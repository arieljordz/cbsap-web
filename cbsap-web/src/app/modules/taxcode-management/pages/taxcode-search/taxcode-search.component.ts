import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TableColumn } from 'src/app/core/model/common/grid-column';
import {
  AlertService,
  ExcelService,
  GridService,
  TaxCodeService,
} from 'src/app/core/services/index';

import {
  DatePipe,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { Pagination, ResponseResult } from 'src/app/core/model/common';
import {
  ExportTaxCodesQuery,
  TaxCode,
  TaxCodeGridQuery,
  TaxCodeSearchModel,
} from 'src/app/core/model/taxcode-management';
import { PrimeImportsModule } from 'src/app/shared/moduleResources/prime-imports';
import { MessageSeverity } from '../../../../core/constants/index';
import { DateFormatPipe } from '../../../../shared/pipes/dateformat.pipe';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import { SearchField } from '@core/model/quick-search/QuickSearchModel';

@Component({
  selector: 'taxcode-search',
  templateUrl: './taxcode-search.component.html',
  styleUrls: ['./taxcode-search.component.scss'],
  providers: [DialogService, AlertService, ConfirmationService],
  standalone: true,
  imports: [
    FormsModule,
    PrimeImportsModule,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    DateFormatPipe,
    QuickSearchComponent,
  ],
})
export class TaxCodeSearchComponent implements OnInit, OnDestroy {
  private destroySubject: Subject<void> = new Subject();

  taxCodeSearchModel: TaxCodeSearchModel = {
    entityName: '',
    taxCodeName: '',
    taxCode: '',
  };

  taxCodes: TaxCode[] = [];
  columns: TableColumn[] = [];

  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortOrder: number = 1;
  triggeredBySearch: boolean = false;
  loading: boolean = true;

  searchActionButtonsConfig = {
    search: true,
    clear: true,
    export: true,
  };

  taxCodeFields: SearchField<TaxCodeSearchModel>[] = [
    {
      key: 'entityName',
      label: 'Entity Name',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'taxCodeName',
      label: 'Tax Code Name',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'taxCode',
      label: 'Tax Code',
      type: 'text',
      fieldType: 'input',
    },
  ];

  @ViewChild('dtTaxCodes') table: Table | undefined;

  constructor(
    private gridService: GridService,
    private taxCodeService: TaxCodeService,
    private message: AlertService,
    private excelService: ExcelService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnDestroy(): void {
    this.destroySubject.next();
  }

  ngOnInit(): void {
    const stored = localStorage.getItem('taxcode-search');
    if (stored) {
      this.taxCodeSearchModel = JSON.parse(stored);
    }

    this.columns = this.gridService.taxCodeManagementColumn();
  }

  addTaxCode() {
    this.router.navigate(['taxcode-management/add-taxcode']);
  }

  editTaxCode(taxCode: TaxCode) {
    const id = taxCode.taxCodeID;
    localStorage.setItem('taxcode-search', JSON.stringify(this.taxCodeSearchModel));
    this.router.navigate(['taxcode-management/edit-taxcode', id]);
  }

  search() {
    this.triggeredBySearch = true;
    this.searchTaxCodes();
  }

  onSearch(filters: TaxCodeSearchModel) {
    this.taxCodeSearchModel = filters;
    this.triggeredBySearch = true;
    this.searchTaxCodes();
  }

  onClear() {
    localStorage.removeItem('taxcode-grid');
    localStorage.removeItem('taxcode-search');
    this.taxCodeSearchModel = {
      entityName: '',
      taxCodeName: '',
      taxCode: '',
    };
    this.triggeredBySearch = true;
    this.pageNumber = 0;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.table?.reset();
    this.searchTaxCodes();
  }

  onAddTaxCode() {
    this.router.navigate(['taxcode-management/add-taxcode']);
  }

  onExport() {
    if (this.totalRecords === 0) {
      this.message.showToast(
        MessageSeverity.warn,
        'Warning',
        'Please hit search button before exporting data.'
      );
      return;
    }

    this.loading = true;

    const exportTaxCodeQuery: ExportTaxCodesQuery = {
      entityName: this.taxCodeSearchModel.entityName,
      code: this.taxCodeSearchModel.taxCode,
      taxCodeName: this.taxCodeSearchModel.taxCodeName,
    };

    if (exportTaxCodeQuery.entityName == null) {
      exportTaxCodeQuery.entityName = '';
    }
    if (exportTaxCodeQuery.code == null) {
      exportTaxCodeQuery.code = '';
    }
    if (exportTaxCodeQuery.taxCodeName == null) {
      exportTaxCodeQuery.taxCodeName = '';
    }

    this.taxCodeService
      .exportTaxCodes(exportTaxCodeQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Blob>) => {
          if (result.isSuccess && result.responseData) {
            const blob = result.responseData;
            this.excelService.saveFile(blob, this.getTimestampedFileName());
          }
          this.loading = false;
        },
      });
  }

  clear() {
    this.onClear();
  }

  searchTaxCodes() {
    const taxCodeGridQuery: TaxCodeGridQuery = {
      EntityName: this.taxCodeSearchModel.entityName || '',
      TaxCodeName: this.taxCodeSearchModel.taxCodeName || '',
      TaxCode: this.taxCodeSearchModel.taxCode || '',
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    };
    
    this.taxCodeService
      .getTaxCodes(taxCodeGridQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Pagination<TaxCode>>) => {
          if (result.isSuccess && result.responseData?.data) {
            this.taxCodes = result.responseData.data;
            this.totalRecords = result.responseData.totalCount;
          }
          this.loading = false;
          this.triggeredBySearch = false;
        },
        error: (error) => this.onError(error),
      });
  }

  onError(error: any) {
    this.message.showToast(MessageSeverity.error, 'Error', 'Error occured.');
  }

  getTimestampedFileName(): string {
    const timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    return `TaxCodes_${timestamp}.xlsx`;
  }

  onLazyLoad(event: any): void {
    if (this.triggeredBySearch) {
      // skip this call since search() already did it
      // avoids double request when search button is clicked
      this.triggeredBySearch = false;
      return;
    }

    this.sortField = event.sortField ? event.sortField : '';
    this.sortOrder = event.sortOrder ? event.sortOrder : 1;
    this.loading = true;
    this.pageNumber = event.first / event.rows + 1; // Calculate page number for the API request
    this.pageSize = event.rows; // Update page size
    this.searchTaxCodes();
  }
}
