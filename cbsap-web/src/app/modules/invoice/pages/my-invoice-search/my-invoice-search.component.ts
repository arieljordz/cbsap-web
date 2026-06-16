import { FormsModule } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { ResponseResult, TableColumn } from '@core/model/common';
import { Subject, filter, takeUntil } from 'rxjs';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import { InvMyInvoiceSearchDto } from '@core/model/invoicing/invoice/invoice-info.dto';
import { Router } from '@angular/router';
import { AlertService, ExcelService, GridService } from '@core/services';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { DialogService } from 'primeng/dynamicdialog';
import { InvoiceDetailService } from '@core/services/invoicing/invoice-detail.service';
import {
  ExportMyInvoiceQuery,
  MyInvoiceSearchModel,
  MyInvoiceSearchQuery,
} from '@core/model/invoicing/invoicing.index';
import { MessageSeverity } from '@core/constants';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import {
  MyInvoiceSearchConfig,
  buildMyInvoiceSearchConfig,
} from '@core/model/invoicing/invoice/invoice-search.configs';
import { MyInvoiceAdvanceSearchComponent } from '../my-invoice-advance-search/my-invoice-advance-search.component';
import { ADVANCESEARCH_CONSTANT } from '@core/constants/advance-search/advance-search-constants';
import { AdvanceSearchEventService } from '@core/services/shared/advance-search.service';

@Component({
  selector: 'app-my-invoice-search',
  standalone: true,
  providers: [DialogService, AlertService, DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    PrimeImportsModule,
    DynamicGridComponent,
    QuickSearchComponent,
  ],
  templateUrl: './my-invoice-search.component.html',
  styleUrl: './my-invoice-search.component.scss',
})
export class MyInvoiceSearchComponent
  implements OnInit, OnDestroy, AfterViewInit
{
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

  gridConfig: GridConfig<InvMyInvoiceSearchDto> | null = null;
  @ViewChild('selectInvoiceTemplate', { static: false })
  selectInvoiceTemplate!: TemplateRef<any>;
  @ViewChild(DynamicGridComponent)
  dynamicGridComponent?: DynamicGridComponent<any>;

  //Quick Search
  readonly searchConfig: MyInvoiceSearchConfig = buildMyInvoiceSearchConfig([
    {
      label: 'Validate',
      icon: 'pi pi-shield',
      severity: 'contrast',
      action: () => this.onInvoiceValidate(),
      outlined: false,
    },
  ]);

  myInvoiceFilter: MyInvoiceSearchModel = {
    suppName: '',
    invNo: '',
    poNo: '',
  };

  selectedInvoices: InvMyInvoiceSearchDto[] = [];


  advanceSearchFilter: MyInvoiceSearchQuery = {
    AdvanceSearchId : 0,
    SupplierName: '',
    InvoiceNo: '',
    PONo: '',
    PaymentTerm: '',
    SupplierNo: '',
    SuppABN: '',
    SuppBankAccount: '',
    EntityProfileID: 0,
    GrNo: '',
    DateRangeInvoiceDate: [],
    DateRangeDueDate: [],
    DaystillDue: 0,
    NetAmount: 0,
    TaxCodeID: 0,
    TaxAmount: 0,
    Currency: '',
    TotalAmount: 0,
    InvRoutingFlowName: '',
    NextRole: '',
    Keyword: '',
    MapID: '',
    DateRangeScanDate: [],
    InvoiceID: '',
    PageNumber: 0,
    PageSize: 0
  };

  constructor(
    private router: Router,
    private gridService: GridService,
    private message: AlertService,
    private excelService: ExcelService,
    private dynamicGridService: DynamicGridService<InvMyInvoiceSearchDto>,
    private invDetailService: InvoiceDetailService,
    private datePipe: DatePipe,
    private dialogService: DialogService,
    private searchEvent: AdvanceSearchEventService
  ) {}

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
  ngAfterViewInit(): void {
    this.initializeDynamicGrid();
  }
  ngOnInit(): void {


    this.searchEvent.reloadSubject$.subscribe(data => {
      if (data === ADVANCESEARCH_CONSTANT.FORMNAME.MYINVOICEQUEUE) {
        this.loadData(1);
      }
    });

    // just remove this since - want to refresh every reload of page
    localStorage.removeItem(ADVANCESEARCH_CONSTANT.LOCALSTORAGE.MYINVOICEQUEUE);
    this.dynamicGridService.setGridKey("myinvoice-grid");
    const stored = localStorage.getItem("myinvoice-search");
    if(stored){
      this.myInvoiceFilter = JSON.parse(stored);
    }    
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
  }

  search(event: MyInvoiceSearchModel) {
    console.log(this.myInvoiceFilter);
    this.myInvoiceFilter = event;
    console.log(event);
    setTimeout(() => {
      if (this.selectInvoiceTemplate) {
        this.initializeDynamicGrid();
      } else {
        this.loadData(1);
      }
    });
  }
  clear() {
    localStorage.removeItem(ADVANCESEARCH_CONSTANT.LOCALSTORAGE.MYINVOICEQUEUE);
    localStorage.removeItem("myinvoice-search");
    localStorage.removeItem("myinvoice-grid");
    this.searchConfig.model.suppName = '';
    this.searchConfig.model.invNo = '';
    this.searchConfig.model.poNo = '';
    this.myInvoiceFilter = {
      suppName: '',
      invNo: '',
      poNo: '',
    };
    this.pageNumber = 1;
    this.pageSize = 10;
    this.sortField = '';
    this.sortOrder = 1;
    this.dynamicGridComponent?.resetTable();
    this.loadData(1);
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
    let exportQuery: ExportMyInvoiceQuery = {
      SupplierName: this.myInvoiceFilter.suppName! || '',
      InvoiceNo: this.myInvoiceFilter.invNo! || '',
      PONo: this.myInvoiceFilter.poNo! || '',
    };

    var store = localStorage.getItem(ADVANCESEARCH_CONSTANT.LOCALSTORAGE.MYINVOICEQUEUE);
    if(store != null){
        this.advanceSearchFilter = JSON.parse(store);
        
        exportQuery.SupplierName = this.advanceSearchFilter.SupplierName ?? exportQuery.SupplierName;
        exportQuery.InvoiceNo = this.advanceSearchFilter.InvoiceNo ?? exportQuery.InvoiceNo;
        exportQuery.PONo  =this.advanceSearchFilter.PONo ?? exportQuery.PONo;
        exportQuery.PaymentTerm = this.advanceSearchFilter.PaymentTerm ?? '';
        exportQuery.SupplierNo = this.advanceSearchFilter.SupplierNo ?? '';
        exportQuery.SuppABN = this.advanceSearchFilter.SuppABN ?? '';
        exportQuery.SuppBankAccount = this.advanceSearchFilter.SuppBankAccount ?? '';
        exportQuery.EntityProfileID = this.advanceSearchFilter.EntityProfileID ?? 0;
        exportQuery.GrNo = this.advanceSearchFilter.GrNo ?? '';
        exportQuery.DaystillDue = this.advanceSearchFilter.DaystillDue ?? 0;
        exportQuery.NetAmount = this.advanceSearchFilter.NetAmount ?? 0;
        exportQuery.TaxCodeID = this.advanceSearchFilter.TaxCodeID ?? 0;
        exportQuery.TaxAmount  = this.advanceSearchFilter.TaxAmount ?? 0;
        exportQuery.Currency = this.advanceSearchFilter.Currency ?? '';
        exportQuery.TotalAmount = this.advanceSearchFilter.TotalAmount ?? 0;
        exportQuery.InvRoutingFlowName = this.advanceSearchFilter.InvRoutingFlowName ?? '';
        exportQuery.NextRole = this.advanceSearchFilter.NextRole ?? '';
        exportQuery.Keyword = this.advanceSearchFilter.Keyword ?? '';
        exportQuery.MapID = this.advanceSearchFilter.MapID ?? '';
        exportQuery.InvoiceID  = this.advanceSearchFilter.InvoiceID ?? '';
        exportQuery.StartDueDate = this.advanceSearchFilter.StartDueDate ?? '';
        exportQuery.EndDueDate = this.advanceSearchFilter.EndDueDate ?? '';
              
    }

    this.loading = true;
    this.invDetailService
      .exportMyInvoices(exportQuery)
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

  onInvoiceValidate(): void {
    if (!this.selectedInvoices.length) {
      this.message.showToast(
        MessageSeverity.warn,
        'Warning',
        'Select a record to validate'
      );
      return;
    }
 
    this.loading = true;
 
    const invoiceIds = this.selectedInvoices.map(x => x.invoiceID);
 
    this.invDetailService
      .validateInvoices(invoiceIds)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (response) => {
 
          if (response.isSuccess) {
            this.message.showToast(
              MessageSeverity.success,
              'Success',
              'Selected records successfully validated'
            );
 
            this.selectedInvoices = [];
            this.loadData(1);
          }
 
          this.loading = false;
        },
        error: () => {
          this.loading = false;
 
          this.message.showToast(
            MessageSeverity.error,
            'Error',
            'Failed to validate records'
          );
        },
      });
  }

  private initializeDynamicGrid() {
    const columns = this.gridService.myInvoiceSearchColumn(
      this.selectInvoiceTemplate
    );
    this.dynamicGridService.setConfig({
      columns,
      data: [],
      totalRecords: 0,
      pageSize: 10,
      pageNumber: 1,
      sortField: '',
      sortOrder: -1,
      // actions: [
      //   {
      //     label: '',
      //     icon: 'pi pi-pencil',
      //     action: (item) => this.editInvoice(item),
      //   },
      // ],
      loading: false,
      rowClick: [
        {
          clickable: (item) => this.editInvoice(item),
          allow: true,
        },
      ],
      gridKey: 'myinvoice-grid'
    });
    this.loadData(1);
  }

  loadData(pageNumber: number) {
    const query: MyInvoiceSearchQuery = {
      SupplierName: this.myInvoiceFilter.suppName! || '',
      InvoiceNo: this.myInvoiceFilter.invNo! || '',
      PONo: this.myInvoiceFilter.poNo! || '',
      PageNumber: pageNumber,
      PageSize: this.gridConfig?.pageSize ?? 10,
      SortField: this.gridConfig?.sortField ?? '',
      SortOrder: this.gridConfig?.sortOrder ?? -1,
    };

    this.dynamicGridService.setLoading(true);
    this.searchMyInvoice(query);
  }

  onLazyLoad(event: any): void {
    const pageNumber = event.pageNumber;
    const rows = event.pageSize ?? 10;
    const sortField = event.sortField || '';
    const sortOrder = event.sortOrder ?? -1;

    const query: MyInvoiceSearchQuery = {
      SupplierName: this.myInvoiceFilter.suppName! || '',
      InvoiceNo: this.myInvoiceFilter.invNo! || '',
      PONo: this.myInvoiceFilter.poNo! || '',
      PageNumber: pageNumber,
      PageSize: rows,
      SortField: sortField,
      SortOrder: sortOrder,
    };
    this.dynamicGridService.setLoading(true);

    this.searchMyInvoice(query);
  }

  searchMyInvoice(query: MyInvoiceSearchQuery) {
    query.SupplierName = this.myInvoiceFilter.suppName! || '';
    query.InvoiceNo = this.myInvoiceFilter.invNo! || '';
    query.PONo = this.myInvoiceFilter.poNo! || '';


    //Advance Search Filter
    var store = localStorage.getItem(ADVANCESEARCH_CONSTANT.LOCALSTORAGE.MYINVOICEQUEUE);
    if(store){
      this.advanceSearchFilter = JSON.parse(store);

      query.SupplierName = this.advanceSearchFilter.SupplierName != '' ? this.advanceSearchFilter.SupplierName : query.SupplierName;
      query.InvoiceNo = this.advanceSearchFilter.InvoiceNo  != '' ? this.advanceSearchFilter.InvoiceNo : query.InvoiceNo;
      query.PONo = this.advanceSearchFilter.PONo  != '' ? this.advanceSearchFilter.PONo : query.PONo;
      query.PaymentTerm = this.advanceSearchFilter.PaymentTerm;
      query.SupplierNo = this.advanceSearchFilter.SupplierNo;
      query.SuppABN = this.advanceSearchFilter.SuppABN;
      query.SuppBankAccount = this.advanceSearchFilter.SuppBankAccount;
      query.EntityProfileID = this.advanceSearchFilter.EntityProfileID;
      query.GrNo = this.advanceSearchFilter.GrNo;
      query.DateRangeInvoiceDate = this.advanceSearchFilter.DateRangeInvoiceDate;
      query.StartInvoiceDate = this.advanceSearchFilter.StartInvoiceDate;
      query.EndInvoiceDate = this.advanceSearchFilter.EndInvoiceDate;
      query.DateRangeDueDate = this.advanceSearchFilter.DateRangeDueDate;
      query.StartDueDate = this.advanceSearchFilter.StartDueDate;
      query.EndDueDate = this.advanceSearchFilter.EndDueDate;
      query.DaystillDue = this.advanceSearchFilter.DaystillDue;
      query.NetAmount = this.advanceSearchFilter.NetAmount;
      query.TaxCodeID = this.advanceSearchFilter.TaxCodeID;
      query.TaxAmount = this.advanceSearchFilter.TaxAmount;
      query.Currency = this.advanceSearchFilter.Currency;
      query.TotalAmount = this.advanceSearchFilter.TotalAmount;
      query.InvRoutingFlowName = this.advanceSearchFilter.InvRoutingFlowName;
      query.NextRole = this.advanceSearchFilter.NextRole;
      query.Keyword = this.advanceSearchFilter.Keyword;
      query.MapID = this.advanceSearchFilter.MapID;
      query.DateRangeScanDate = this.advanceSearchFilter.DateRangeScanDate;
      query.StartScanDate = this.advanceSearchFilter.StartScanDate;
      query.EndScanDate = this.advanceSearchFilter.EndScanDate;
      query.InvoiceID = this.advanceSearchFilter.InvoiceID;
    }

    this.invDetailService
      .myInvoiceSearch(query)
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

  onRowCheckboxChange(checked: boolean, row: InvMyInvoiceSearchDto): void {
    if (checked) {
      const exists = this.selectedInvoices.some(
        (x) => x.invoiceID === row.invoiceID
      );
 
      if (!exists) {
        this.selectedInvoices.push(row);
      }
    } else {
      this.selectedInvoices = this.selectedInvoices.filter(
        (x) => x.invoiceID !== row.invoiceID
      );
    }
  }

  editInvoice(invoice: any) {
    const id = invoice.invoiceID;
    /*by pass this */
    localStorage.setItem('myinvoice-search',JSON.stringify(this.myInvoiceFilter));
    this.router.navigate(['invoices', id, 'edit'], {
      state: { returnUrl: this.router.url },
    });
  }

  getTimestampedFileName(): string {
    const timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    return `MyInvoices_${timestamp}.xlsx`;
  }
  
  advanceSearch() {

    this.dialogService.open(MyInvoiceAdvanceSearchComponent, {
      width: '900px',
      style: { minHeight: '200px' },
      modal: true,
      closable: true,
      baseZIndex: 1200,
      header : 'Advance Search',
      data :{
        formName : ADVANCESEARCH_CONSTANT.FORMNAME.MYINVOICEQUEUE
      }
    });


  }

}
