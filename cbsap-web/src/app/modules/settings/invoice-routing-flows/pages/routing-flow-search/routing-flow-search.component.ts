import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageSeverity } from '@core/constants';
import { ResponseResult, TableColumn } from '@core/model/common';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import {
  InvRoutingFlowExportQuery,
  SearchInvRoutingFlowDto,
  SearchInvRoutingFlowQuery,
  SearchInvRoutingModel,
} from '@core/model/invoicing/invoicing.index';
import {
  CustomButton,
  SearchField,
} from '@core/model/quick-search/QuickSearchModel';
import {
  AlertService,
  ExcelService,
  GridService,
  InvRoutingFlowService,
} from '@core/services';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { RoutingFlowRolesComponent } from '@modules/settings/invoice-routing-flows/pages/routing-flow-roles/routing-flow-roles.component';
import { RoutingFlowUsersComponent } from '@modules/settings/invoice-routing-flows/pages/routing-flow-users/routing-flow-users.component';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-routing-flow-search',
  standalone: true,
  providers: [AlertService, DialogService, DynamicGridService],
  imports: [
    FormsModule,
    PrimeImportsModule,
    DynamicGridComponent,
    CommonModule,
    QuickSearchComponent,
  ],
  templateUrl: './routing-flow-search.component.html',
  styleUrl: './routing-flow-search.component.scss',
})
export class RoutingFlowSearchComponent implements OnInit, AfterViewInit {
  private destroySubject: Subject<void> = new Subject();

  invRoutingFlowPagination: SearchInvRoutingFlowDto[] = [];
  columns: TableColumn[] = [];
  sizes: any;

  totalRecords: number = 0;

  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  sortField?: string = '';
  sortOrder: number = 1;

  invRoutingSearchFields: SearchField<SearchInvRoutingModel>[] = [
    {
      key: 'entityName',
      label: 'Entity',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'invRoutingFlowName',
      label: 'Invoice Routing Flow Name',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'roles',
      label: 'Roles',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'supplier',
      label: 'Supplier Linked',
      type: 'text',
      fieldType: 'input',
    },
    {
      key: 'matchReference',
      label: 'Keyword',
      type: 'text',
      fieldType: 'input',
    },
  ];

  searchInvRoutingModel: SearchInvRoutingModel = {
    entityName: '',
    invRoutingFlowName: '',
    roles: '',
    supplier: '',
    matchReference: '',
  };

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

  //-- dynamic grid set up
  gridConfig: GridConfig<SearchInvRoutingFlowDto> | null = null;
  @ViewChild('rolesTemplate', { static: false })
  rolesTemplate!: TemplateRef<any>;
  @ViewChild('usersTemplate', { static: false })
  usersTemplate!: TemplateRef<any>;
  @ViewChild(DynamicGridComponent)
  dynamicGridComponent?: DynamicGridComponent<any>;

  constructor(
    private router: Router,
    private gridService: GridService,
    private message: AlertService,
    private excelService: ExcelService,
    private invRoutingFlowService: InvRoutingFlowService,
    private dialogService: DialogService,
    private dynamicGridService: DynamicGridService<SearchInvRoutingFlowDto>
  ) {}

  ngAfterViewInit(): void {
    this.initializeDynamicGrid();
  }

  ngOnInit(): void {
    const stored = localStorage.getItem('routingflow-search');
    if(stored){
      this.searchInvRoutingModel = JSON.parse(stored);
    }
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
  }

  /** Grid Set up */
  private initializeDynamicGrid() {
    const columns = this.gridService.invRoutingFlowGridColumn(
      this.rolesTemplate,
      this.usersTemplate
    );

    this.dynamicGridService.setConfig({
      columns,
      data: [],
      totalRecords: 0,
      pageSize: 10,
      pageNumber: 1,
      sortField: '',
      sortOrder: -1,
      loading: true,
      rowClick:[
        {
          clickable: (item) => this.editInvRoutingFlow(item),
          allow:true
        }
      ],
      gridKey: 'routingflow-grid'
    });
  }

  onAdvancedSearch() {}

  loadData(pageNumber: number) {
    const query: SearchInvRoutingFlowQuery = {
      EntityName: this.searchInvRoutingModel.entityName,
      InvRoutingFlowName: this.searchInvRoutingModel.invRoutingFlowName,
      Roles: this.searchInvRoutingModel.roles,
      LinkSupplier: this.searchInvRoutingModel.supplier,
      MatchReference: this.searchInvRoutingModel.matchReference,
      PageNumber: pageNumber,
      PageSize: this.gridConfig?.pageSize ?? 10,
      SortField: this.gridConfig?.sortField ?? '',
      SortOrder: this.gridConfig?.sortOrder ?? -1,
    };

    this.dynamicGridService.setLoading(true);

    this.searchInvRoutingFlow(query);
  }

  onLazyLoad(event: any): void {
    const pageNumber = event.pageNumber;
    const rows = event.pageSize ?? 10;
    const sortField = event.sortField || '';
    const sortOrder = event.sortOrder ?? -1;

    const searchInvRoutingFlowQuery: SearchInvRoutingFlowQuery = {
      EntityName: this.searchInvRoutingModel.entityName,
      InvRoutingFlowName: this.searchInvRoutingModel.invRoutingFlowName,
      Roles: this.searchInvRoutingModel.roles,
      LinkSupplier: this.searchInvRoutingModel.supplier,
      MatchReference: this.searchInvRoutingModel.matchReference,
      PageNumber: pageNumber,
      PageSize: rows,
      SortField: sortField,
      SortOrder: sortOrder,
    };
    this.dynamicGridService.setLoading(true);
    this.searchInvRoutingFlow(searchInvRoutingFlowQuery);
  }

  /** button action */
  editInvRoutingFlow(invRoutingFlow: any): void {
    const id = invRoutingFlow.invRoutingFlowID;
    localStorage.setItem('routingflow-search',JSON.stringify(this.searchInvRoutingModel));
    this.router.navigate(['inv-routing-flow-management/edit-routing-flow', id]);
  }
  search(filters: SearchInvRoutingModel) {
    this.searchInvRoutingModel = {
      entityName: filters.entityName || '',
      invRoutingFlowName: filters.invRoutingFlowName || '',
      roles: filters.roles || '',
      supplier: filters.supplier || '',
      matchReference: filters.matchReference || '',
    };

    setTimeout(() => {
      if (this.rolesTemplate && this.usersTemplate) {
        this.initializeDynamicGrid();
      }

      this.loadData(1);
    });
  }

  exportToExcel() {
    if (this.totalRecords === 0) {
      this.message.showToast(
        MessageSeverity.warn,
        'Warning ',
        'Please hit search button before exporting data'
      );
      return;
    }
    let exportInvRoutingFlowQuery: InvRoutingFlowExportQuery = {
      EntityName: this.searchInvRoutingModel.entityName,
      InvRoutingFlowName: this.searchInvRoutingModel.invRoutingFlowName,
      Roles: this.searchInvRoutingModel.roles,
      LinkSupplier: this.searchInvRoutingModel.supplier,
      MatchReference: this.searchInvRoutingModel.matchReference,
    };

    this.invRoutingFlowService
      .exportInvRoutingFlow(exportInvRoutingFlowQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (result: ResponseResult<Blob>) => {
          if (result.isSuccess) {
            if (result.responseData) {
              const blob = result.responseData;
              this.excelService.saveFile(
                blob,
                this.excelService.excelFileName('InvoiceRoutingFlow')
              );
            } else {
            }
            this.loading = false;
          }
        },
        error: (error) => this.onError(error),
      });
  }
  clear() {
    localStorage.removeItem("routingflow-grid");
    localStorage.removeItem("routingflow-search");
    this.searchInvRoutingModel = {
      entityName: '',
      invRoutingFlowName: '',
      roles: '',
      supplier: '',
      matchReference: '',
    };
    this.pageNumber = 0;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.dynamicGridComponent?.resetTable();
    this.loadData(1);
  }
  addInvRoutingFlow() {
    this.router.navigate(['inv-routing-flow-management/add-routing-flow']);
  }

  /** modal set up */
  openSearchInvRoutingFlowByUser(invRoutingFlow: any) {
    this.dialogService.open(RoutingFlowUsersComponent, {
      header: `Users under [${invRoutingFlow.invoiceRoutingFlowName}]`,
      width: '40vw',
      modal: true,
      closable: true,
      data: {
        invRoutingFlowID: invRoutingFlow.invRoutingFlowID,
      },
      breakpoints: {
        '960px': '45vw',
        '640px': '50vw',
      },
    });
  }
  openSearchInvRoutingFlowByRoles(invRoutingFlow: any) {
    this.dialogService.open(RoutingFlowRolesComponent, {
      header: `Roles under [${invRoutingFlow.invoiceRoutingFlowName}]`,
      width: '40vw',
      modal: true,
      closable: true,
      data: {
        invRoutingFlowID: invRoutingFlow.invRoutingFlowID,
      },
      breakpoints: {
        '960px': '45vw',
        '640px': '50vw',
      },
    });
  }

  searchInvRoutingFlow(searchInvRoutingFlowQuery: SearchInvRoutingFlowQuery) {
    this.invRoutingFlowService
      .searchInvRoutingFlow(searchInvRoutingFlowQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.dynamicGridService.updateData(
              res.responseData?.data ?? [],
              res.responseData?.totalCount ?? 0,
              searchInvRoutingFlowQuery.PageSize
            );

            this.totalRecords = res.responseData?.totalCount ?? 0;
          }
        },
        error: () => {
          this.dynamicGridService.setLoading(false);
        },
      });
  }

  onError(error: any) {}
}
