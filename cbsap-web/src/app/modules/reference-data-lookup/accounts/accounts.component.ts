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
import { AlertService, ExcelService, LookUpsService } from '@core/services';
import { Pagination, ResponseResult } from '@core/model/common';
import {
  ExportAccountsQuery,
  SearchAccountLookUpQuery,
} from '@core/model/accounts/search-account.querry';
import { SearchAccountLookupDto } from '@core/model/accounts/search-account.dto';
import { Subject, takeUntil } from 'rxjs';
import { Table } from 'primeng/table';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import {
  CustomButton,
  SearchField,
} from '@core/model/quick-search/QuickSearchModel';
import { TableColumn } from '@core/model/common/grid-column';
import { getStatusFilterOptions } from '@core/constants/common/statusFilterOptions';
import { MessageSeverity } from '@core/constants';
import { YesnoPipe } from '@shared/pipes/yesno.pipe';

interface AccountSearchModel {
  entity: string;
  accountName: string;
  account: string;
  active: boolean | null;
}

interface AccountGridItem {
  entity: string;
  accountName: string;
  accountId: string;
  dimension1?: string;
  dimension2?: string;
  dimension3?: string;
  dimension4?: string;
  dimension5?: string;
  dimension6?: string;
  dimension7?: string;
  taxcodeMandatory: boolean;
  active: boolean;
}

@Component({
  selector: 'app-accounts',
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
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly sortFieldMap: Record<string, string> = {
    entity: 'entityName',
    accountName: 'accountName',
    accountId: 'accountID',
    taxcodeMandatory: 'taxcodeMandatory',
    active: 'active',
  };

  constructor(
    private lookUpsService: LookUpsService,
    private excelService: ExcelService,
    private alertService: AlertService
  ) {}

  accountSearchModel: AccountSearchModel = {
    entity: '',
    accountName: '',
    account: '',
    active: null,
  };

  accountSearchFields: SearchField<AccountSearchModel>[] = [
    {
      key: 'entity',
      label: 'Entity',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'accountName',
      label: 'Account Name',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'account',
      label: 'Account',
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
    {
      field: 'accountName',
      header: 'Account Name',
      sort: true,
      isSearchFilter: false,
    },
    {
      field: 'accountId',
      header: 'Account ID',
      sort: true,
      isSearchFilter: false,
    },
    {
      field: 'dimension1',
      header: 'Dimension 1',
      sort: false,
      isSearchFilter: false,
    },
    {
      field: 'dimension2',
      header: 'Dimension 2',
      sort: false,
      isSearchFilter: false,
    },
    {
      field: 'dimension3',
      header: 'Dimension 3',
      sort: false,
      isSearchFilter: false,
    },
    {
      field: 'dimension4',
      header: 'Dimension 4',
      sort: false,
      isSearchFilter: false,
    },
    {
      field: 'dimension5',
      header: 'Dimension 5',
      sort: false,
      isSearchFilter: false,
    },
    {
      field: 'dimension6',
      header: 'Dimension 6',
      sort: false,
      isSearchFilter: false,
    },
    {
      field: 'dimension7',
      header: 'Dimension 7',
      sort: false,
      isSearchFilter: false,
    },
    {
      field: 'taxcodeMandatory',
      header: 'Taxcode Mandatory',
      sort: true,
      isSearchFilter: false,
      dataType: 'tag',
    },
    {
      field: 'active',
      header: 'Active Status',
      sort: true,
      isSearchFilter: false,
      dataType: 'tag',
    }
  ];

  accounts: AccountGridItem[] = [];

  totalRecords = 0;
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortOrder = 1;
  triggeredBySearch = false;
  loading = false;

  @ViewChild('dtAccounts') table: Table | undefined;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(filters: AccountSearchModel): void {
    this.accountSearchModel = {
      entity: filters?.entity ?? '',
      accountName: filters?.accountName ?? '',
      account: filters?.account ?? '',
      active: filters?.active ?? null,
    };
    this.triggeredBySearch = true;
    this.pageNumber = 1;
    this.loadAccounts();
  }

  onClear(): void {
    this.accountSearchModel = {
      entity: '',
      accountName: '',
      account: '',
      active: null,
    };
    this.triggeredBySearch = true;
    this.pageNumber = 1;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.table?.reset();
    this.loadAccounts();
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
      .exportAccounts(exportQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: ResponseResult<Blob>) => {
          if (result.isSuccess && result.responseData) {
            const fileName = this.excelService.excelFileName('Accounts');
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
            'Unable to export accounts at this time.'
          );
          this.loading = false;
        },
      });
  }

  onAdvancedSearch(): void {
    // TODO: wire advanced search modal or navigation.
  }

  onLazyLoad(event: any): void {
    if (this.triggeredBySearch) {
      this.triggeredBySearch = false;
      return;
    }

    this.sortField = event.sortField ? event.sortField : '';
    this.sortOrder = event.sortOrder ? event.sortOrder : 1;
  this.loading = true;
  this.pageNumber = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadAccounts();
  }

  private loadAccounts(): void {
    const query = this.buildSearchQuery();
    this.loading = true;

    this.lookUpsService
      .accountSearchLookUp(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (
          result: ResponseResult<Pagination<SearchAccountLookupDto>>
        ) => {
          if (result.isSuccess && result.responseData) {
            this.accounts = (result.responseData.data ?? []).map((item) =>
              this.mapAccountToGridItem(item)
            );
            this.totalRecords = result.responseData.totalCount;
          } else {
            this.accounts = [];
            this.totalRecords = 0;
          }

          this.loading = false;
          this.triggeredBySearch = false;
        },
        error: () => {
          this.accounts = [];
          this.totalRecords = 0;
          this.loading = false;
          this.triggeredBySearch = false;
        },
      });
  }

  private buildSearchQuery(): SearchAccountLookUpQuery {
    const accountInput = this.accountSearchModel.account?.trim();
    const accountId = accountInput && !isNaN(Number(accountInput))
      ? Number(accountInput)
      : null;

    const sortField = this.mapSortField(this.sortField);

    const query: SearchAccountLookUpQuery = {
      accountID: accountId,
      accountName: this.accountSearchModel.accountName?.trim() || null,
      entityName: this.accountSearchModel.entity?.trim() || null,
      active: this.accountSearchModel.active,
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

  private buildExportQuery(): ExportAccountsQuery {
    const searchQuery = this.buildSearchQuery();

    return {
      accountID: searchQuery.accountID,
      accountName: searchQuery.accountName,
      entityName: searchQuery.entityName,
      active: searchQuery.active,
    };
  }

  private mapAccountToGridItem(
    account: SearchAccountLookupDto
  ): AccountGridItem {
    const extendedAccount = account as unknown as Record<string, unknown>;

    return {
      entity: account.entityName ?? '',
      accountName: account.accountName ?? '',
      accountId:
        account.accountID !== null && account.accountID !== undefined
          ? String(account.accountID)
          : '',
      dimension1: (extendedAccount['dimension1'] as string) ?? undefined,
      dimension2: (extendedAccount['dimension2'] as string) ?? undefined,
      dimension3: (extendedAccount['dimension3'] as string) ?? undefined,
      dimension4: (extendedAccount['dimension4'] as string) ?? undefined,
      dimension5: (extendedAccount['dimension5'] as string) ?? undefined,
      dimension6: (extendedAccount['dimension6'] as string) ?? undefined,
      dimension7: (extendedAccount['dimension7'] as string) ?? undefined,
      taxcodeMandatory: this.toBoolean(extendedAccount['taxcodeMandatory']),
      active: this.toBoolean(account.active),
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
