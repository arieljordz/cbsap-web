import { CommonModule, NgFor, NgSwitchCase } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  buildSearchAccountConfig,
  getDefaultSearchAccountModel,
  SearchAccountConfig,
} from '@core/model/accounts/search-account.config';
import { SearchAccountLookupDto } from '@core/model/accounts/search-account.dto';
import { SearchAccountModel } from '@core/model/accounts/search-account.model';
import { SearchAccountLookUpQuery } from '@core/model/accounts/search-account.querry';

import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import { GridService, LookUpsService } from '@core/services';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';

import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { TableColumn } from '@core/model/common';

@Component({
  selector: 'app-account-search',
  standalone: true,
  providers: [DialogService, DynamicGridService],
  imports: [
    CommonModule,
    FormsModule,
    PrimeImportsModule,
    NgFor,
    NgSwitchCase,
    DynamicGridComponent,
  ],
  templateUrl: './account-search.component.html',
  styleUrl: './account-search.component.scss',
})
export class AccountSearchComponent implements OnInit, OnDestroy {
  private destroySubject: Subject<void> = new Subject();

  columns: TableColumn[] = [];
  sizes: any;

  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  sortField?: string = '';
  sortOrder: number = 1;

  gridConfig: GridConfig<SearchAccountLookupDto> | null = null;

  @ViewChild(DynamicGridComponent)
  dynamicGridComponent?: DynamicGridComponent<any>;

  readonly searchAccountConfig: SearchAccountConfig =
    buildSearchAccountConfig();

  fieldRows: any[][] = [];

  searchfilters: Record<string, any> = {
    accountID: null,
    accountName: '',
    entityName: '',
    active: null,
  };

  isShowSearchSupplier: boolean = false;

  constructor(
    private lookOptionService: LookUpsService,
    private gridService: GridService,
    private dynamicGridService: DynamicGridService<SearchAccountLookupDto>,
    private dialogRef: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
    this.initializeDynamicGrid();
    this.prepareFieldRows();
  }
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  private initializeDynamicGrid() {
    const columns = this.gridService.accountSearchLookUpGridColumn();

    this.dynamicGridService.setConfig({
      columns,
      data: [],
      totalRecords: 0,
      pageSize: 10,
      pageNumber: 1,
      sortField: '',
      sortOrder: -1,

      loading: false,
    });
    this.loadData(1);

    this.dynamicGridService.setConfig({
      columns,
      data: [],
      totalRecords: 0,
      pageSize: 10,
      pageNumber: 1,
      sortField: '',
      sortOrder: -1,
      loading: false,
      rowClick: [
        {
          clickable: (item) => this.selectAccount(item),
          allow: true,
        },
      ],
    });
    this.loadData(1);
  }

  loadData(pageNumber: number) {
    const searchCriteria: SearchAccountModel = this
      .searchfilters as SearchAccountModel;
    const query: SearchAccountLookUpQuery = {
      accountID: searchCriteria.accountID,
      accountName: searchCriteria.accountName,
      entityName: searchCriteria.entityName,
      active: searchCriteria.active,
      PageNumber: pageNumber,
      PageSize: this.gridConfig?.pageSize ?? 10,
      SortField: this.gridConfig?.sortField ?? '',
      SortOrder: this.gridConfig?.sortOrder ?? -1,
    };

    this.dynamicGridService.setLoading(true);
    this.searchAccounts(query);
  }

  onLazyLoad(event: any): void {
    const pageNumber = event.pageNumber;
    const rows = event.pageSize ?? 10;
    const sortField = event.sortField || '';
    const sortOrder = event.sortOrder ?? -1;

    const searchCriteria: SearchAccountModel = this
      .searchfilters as SearchAccountModel;
    const query: SearchAccountLookUpQuery = {
      accountID: searchCriteria.accountID,
      accountName: searchCriteria.accountName,
      entityName: searchCriteria.entityName,
      active: searchCriteria.active,
      PageNumber: pageNumber,
      PageSize: rows,
      SortField: sortField,
      SortOrder: sortOrder,
    };

    this.dynamicGridService.setLoading(true);
    this.searchAccounts(query);
  }

  searchAccounts(query: SearchAccountLookUpQuery) {
    console.log('searchAccounts', query);
    this.lookOptionService
      .accountSearchLookUp(query)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.dynamicGridService.updateData(
              res.responseData?.data ?? [],
              res.responseData?.totalCount ?? 0,
              query.PageSize
            );

            this.totalRecords = res.responseData?.totalCount ?? 0;
          }
        },
        error: () => {
          this.dynamicGridService.setLoading(false);
        },
      });
  }
  search() {
    this.isShowSearchSupplier = true;
    this.loadData(1);
  }
  clear() {
    this.searchfilters = getDefaultSearchAccountModel();
    this.dynamicGridComponent?.resetTable();
  }

  selectAccount(account: any): void {
    this.dialogRef.close(account);
  }
  prepareFieldRows() {
    const chunkSize = 3;
    const fields = this.searchAccountConfig.fields || [];

    const displayFields = [];
    for (let i = 0; i < fields.length; i += chunkSize) {
      displayFields.push(fields.slice(i, i + chunkSize));
    }
    this.fieldRows = displayFields;
  }
}
