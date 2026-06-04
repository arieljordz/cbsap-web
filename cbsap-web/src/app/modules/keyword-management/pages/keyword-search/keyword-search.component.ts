import { ExportKeywordQuery, Keyword } from './../../../../core/model/keyword-management/index';
import {
  Component,
  inject,
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
  KeywordService
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
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Pagination, ResponseResult } from 'src/app/core/model/common';

import { PrimeImportsModule } from 'src/app/shared/moduleResources/prime-imports';
import { MessageSeverity } from '../../../../core/constants/index';
import { DateFormatPipe } from '../../../../shared/pipes/dateformat.pipe';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import { SearchField } from '@core/model/quick-search/QuickSearchModel';
import { KeywordGridQuery, KeywordSearchModel } from '@core/model/keyword-management';

@Component({
  selector: 'keyword-search',
  templateUrl: './keyword-search.component.html',
  styleUrls: ['./keyword-search.component.scss'],
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
export class KeywordSearchComponent implements OnInit, OnDestroy {
  private destroySubject: Subject<void> = new Subject();

  keywordSearchModel: KeywordSearchModel = {
    entityName: '',
    invoiceRoutingFlowName: '',
    keywordName: '',
  };

  keywords: Keyword[] = [];
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

  keywordFields: SearchField<KeywordSearchModel>[] = [
    {
      key: 'keywordName',
      label: 'Keyword',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'entityName',
      label: 'Entity',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'invoiceRoutingFlowName',
      label: 'Invoice Routing Flow',
      type: 'text',
      fieldType: 'input',
    },

  ];

  keywordService = inject(KeywordService);

  @ViewChild('dtKeywords') table: Table | undefined;

  constructor(
    private gridService: GridService,
    private message: AlertService,
    private excelService: ExcelService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService
  ) { }

  ngOnDestroy(): void {
    this.destroySubject.next();
  }

  ngOnInit(): void {
    this.columns = this.gridService.keywordManagementColumn();
  }


  editKeyword(keyword: Keyword) {
    const id = keyword.keywordID;
    this.router.navigate(['keyword-management/edit-keyword', id]);
  }

  search() {
    this.triggeredBySearch = true;
    this.searchKeywords();
  }

  onSearch(filters: KeywordSearchModel) {
    this.keywordSearchModel = filters;
    this.triggeredBySearch = true;
    this.searchKeywords();
  }

  onClear() {
    this.keywordSearchModel = {
      entityName: '',
      invoiceRoutingFlowName: '',
      keywordName: '',
    };
    this.triggeredBySearch = true;
    this.pageNumber = 0;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.table?.reset();
    this.searchKeywords();
  }

  onAddKeyword() {
    this.router.navigate(['keyword-management/add-keyword']);
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

    const exportKeywordQuery: ExportKeywordQuery = {
      entityName: this.keywordSearchModel.entityName,
      invoiceRoutingFlowName: this.keywordSearchModel.invoiceRoutingFlowName,
      keywordName: this.keywordSearchModel.keywordName,
    };

    exportKeywordQuery.entityName = exportKeywordQuery.entityName || '';
    exportKeywordQuery.invoiceRoutingFlowName = exportKeywordQuery.invoiceRoutingFlowName || '';
    exportKeywordQuery.keywordName = exportKeywordQuery.keywordName || '';

    this.keywordService
      .exportKeyword(exportKeywordQuery)
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

  searchKeywords() {
    const keywordGridQuery: KeywordGridQuery = {
      keywordName: this.keywordSearchModel.keywordName || '',
      entityName: this.keywordSearchModel.entityName || '',
      invoiceRoutingFlowName: this.keywordSearchModel.invoiceRoutingFlowName || '',
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    };

    this.keywordService
      .getKeywords(keywordGridQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Pagination<Keyword>>) => {
          if (result.isSuccess && result.responseData?.data) {
            this.keywords = result.responseData.data;
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
    return `Keywords_${timestamp}.xlsx`;
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
    this.searchKeywords();
  }

  deleteConfirmation(keyword: any) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete this keyword?',
      header: 'Confirm Deletion',
      accept: () => {
        this.deleteKeyword(keyword);
      },
    });
  }

  private deleteKeyword(keyword: Keyword) {
    this.keywordService
      .deleteKeyword(keyword.keywordID).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.message.showToast(
              MessageSeverity.success.toString(),
              'Keyword Deletion',
              'Keyword has been successfully deleted',
              2000
            );
            this.searchKeywords();
          }
        },
        error: (error: ResponseResult<boolean>) => {
          this.message.showToast(
            MessageSeverity.error.toString(),
            'Error on Keyword Deletion',
            error.messages?.[0],
            2000
          );
        }
      });
  }
}
