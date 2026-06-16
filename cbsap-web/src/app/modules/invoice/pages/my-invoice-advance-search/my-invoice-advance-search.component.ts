    import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
    import { CommonModule, NgIf } from '@angular/common';
    import {FormsModule, ReactiveFormsModule } from '@angular/forms';
    import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
    import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
    import { SelectTableComponent } from '@shared/popup/select-table/select-table.component';
    import { GridService, InvoiceDetailService, KeywordService, LookupOptionsService, LookUpsService } from '@core/services';
    import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
    import { InvSearchSupplierDto, InvSupplierLookUpQuery, MyInvoiceSearchQuery, RoutingFlowLookupDto, RoutingFlowLookupQuery } from '@core/model/invoicing/invoicing.index';
    import { SelectItem } from 'primeng/api';
    import { createInvInfoForm, InvInfoFormGroup } from '@core/model/invoicing/my-invoice-advance-search/my-invoice-advance-search.forms';
    import { POSearchQuery } from '@core/model/purchase-order/po.query';
    import { POSearchDto } from '@core/model/purchase-order/po-search.dto';
    import { PurchaseOrderService } from '@core/services/purchase-order/purchase-order.service';
    import { SearchGoodsReceiptQuery } from '@core/model/goods-receipt/search-goods-receipt.query';
    import { formatToIsoDate } from '@core/utils/shared-utils';
    import { SearchGoodsReceiptLookupDto } from '@core/model/goods-receipt/search-goods-receipt.dto';
    import {
      AmountDto, InvMyInvoiceSearchDto
    } from '@core/model/invoicing/invoice/invoice-info.dto';
import { Keyword, KeywordGridQuery } from '@core/model/keyword-management';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { Router } from '@angular/router';
import { AdvanceSearchService } from '@core/services/advance-search/advance-search.service';
import { ResponseResult } from '@core/model/common/responseResult';
import { AdvanceSearchDto } from '@core/model/advance-search/advanceSearchDto';
import { ADVANCESEARCH_CONSTANT } from '@core/constants/advance-search/advance-search-constants';
import { INV_ENPOINT } from '@core/constants';
import { AdvanceSearchEventService } from '@core/services/shared/advance-search.service';


    @Component({
    selector: 'app-my-invoice-advance-search',
    standalone: true,
    imports: [
      PrimeImportsModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      NgIf,
    ],
    templateUrl: './my-invoice-advance-search.component.html',
    styleUrl: './my-invoice-advance-search.component.scss'
    })
    export class MyInvoiceAdvanceSearchComponent implements OnInit {

    // this is from External before click the advancesearh
    formName: any;

    private destroy$ = new Subject<void>();
    invInfoForm!: InvInfoFormGroup;

    private supplierDataList$ = new BehaviorSubject<any[]>([]);
    private supplierTotalRecord$ = new BehaviorSubject<number>(0);

    private purchaseOrderDataList$ = new BehaviorSubject<POSearchDto[]>([]);
    private purchaseOrderTotalRecord$ = new BehaviorSubject<number>(0);
    purchaseOrderTotalRecords = 0;
    purchaseOrderData: POSearchDto[] = [];
    selectedPurchaseOrder?: POSearchDto;

    private goodsReceiptDataList$ = new BehaviorSubject<SearchGoodsReceiptLookupDto[]>([]);
    private goodsReceiptTotalRecord$ = new BehaviorSubject<number>(0);
    goodsReceiptTotalRecords = 0;
    goodsReceiptData: SearchGoodsReceiptLookupDto[] = [];
    selectedGoodsReceipt?: SearchGoodsReceiptLookupDto

    private routingFlowDataList$ = new BehaviorSubject<any[]>([]);
    private routingFlowTotalRecords$ = new BehaviorSubject<number>(0);
    routingFlowTotalRecords=0;
    routingFlowData: RoutingFlowLookupDto[] = [];
    selectedRoutingFlow?: RoutingFlowLookupDto;

    private keywordDataList$ = new BehaviorSubject<Keyword[]>([]);
    private keywordTotalRecord$ = new BehaviorSubject<number>(0);
    keywordTotalRecords = 0;
    keywordData: Keyword[] = [];
    selectedKeyword?: Keyword;

    supplierTotalRecords = 0;
    supplierData: InvSearchSupplierDto[] = [];
    entityOptions?: SelectItem[] = [];
    taxCodeOptions?: SelectItem[] = [];
    selectedSupplier?: InvSearchSupplierDto;
    private destroySubject: Subject<void> = new Subject();
    invInfoDropdown: Record<string, SelectItem[]> = {};

    readonly entityOptions$ = this.lookUpOptionService.entityOptions$;
    readonly taxCodeLookUpOptions$ =
      this.lookUpOptionService.taxCodeLookUpOptions$;

      amountDto: AmountDto = {
        netAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
      };
    
      @Output() amounts = new EventEmitter<AmountDto>();

      myInvoiceFilter: MyInvoiceSearchQuery = {
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

      totalRecords: number = 0;

    constructor(
      private dialogService: DialogService,
      private dialogref : DynamicDialogRef,
      private gridService: GridService,
      private lookOptionService: LookUpsService,
      private invDetailService: InvoiceDetailService,
      private lookUpOptionService: LookupOptionsService,
      private purchaseOrderService: PurchaseOrderService,
      private keywordService: KeywordService,
      private dynamicGridService: DynamicGridService<InvMyInvoiceSearchDto>,
      private router: Router,
      private advanceSearchService: AdvanceSearchService,  
      private dialogConfig : DynamicDialogConfig,
      private searchEvent: AdvanceSearchEventService   
    ){
      this.invInfoForm = createInvInfoForm();
    }

    //#region Initialize

    ngOnInit(): void {


    this.initiliazeDropdown();   
    this.formName = this.dialogConfig.data.formName;

    this.retrieveRecord();

    }
    private retrieveRecord(){
      this.advanceSearchService.getAdvanceSearch(this.formName).subscribe({
        next: (response) => {
          if (response.isSuccess) {

         
            const entity = response.responseData as AdvanceSearchDto;
 
            this.invInfoForm.patchValue({
              advanceSearchId: entity.advanceSearchId,
              supplierName: entity.supplierName,
              invoiceNo: entity.invoiceNo,
              poNo: entity.pONo,
              paymentTerm: entity.paymentTerm,
              supplierNo: entity.supplierNo,
              suppABN: entity.suppABN,
              suppBankAccount: entity.suppBankAccount,
              entityProfileID: entity.entityProfileID,
              grNo: entity.grNo,
              dateRangeInvoiceDate: entity.startInvoiceDate && entity.endInvoiceDate? [new Date(entity.startInvoiceDate), new Date(entity.endInvoiceDate)]: null,
              dateRangeDueDate: entity.startDueDate && entity.endDueDate? [new Date(entity.startDueDate), new Date(entity.endDueDate)]: null,
              dateRangeScanDate: entity.startScanDate && entity.endScanDate? [new Date(entity.startScanDate), new Date(entity.endScanDate)]: null,
              startInvoiceDate: entity.endDueDate ? new Date(entity.endDueDate) : null,
              endInvoiceDate: entity.endInvoiceDate ? new Date(entity.endInvoiceDate) : null,
              startDueDate:entity.startDueDate ? new Date(entity.startDueDate) : null,
              endDueDate:entity.endDueDate ? new Date(entity.endDueDate) : null,
              daysTillDue: (entity.daystillDue! > 0) ? entity.daystillDue : null,
              netAmount:  (entity.netAmount! > 0) ? entity.netAmount : null,
              taxCodeID: entity.taxCodeID,
              taxAmount:  (entity.taxAmount! > 0) ? entity.taxAmount : null,
              currency: entity.currency,
              totalAmount: (entity.totalAmount! > 0) ? entity.totalAmount : null,
              invRoutingFlowName: entity.invRoutingFlowName,
              nextRole: entity.nextRole,
              keyword: entity.keyword,
              mapID: entity.mapID,
              startScanDate: entity.startScanDate ? new Date(entity.startScanDate) : null,
              endScanDate: entity.endScanDate ? new Date(entity.endScanDate) : null,
              invoiceID: entity.invoiceID,
              isSaveAsTemplate : (entity.advanceSearchId! > 0) ? true : false /*means not save in DB*/
});

// add this for Update/ delete function
this.myInvoiceFilter.AdvanceSearchId = entity.advanceSearchId;


          }
        },
        error: (error: ResponseResult<boolean>) => {
  
        },
        complete: () => {
          
        }
      });
    }


    private transferFilter (){
            this.myInvoiceFilter.AdvanceSearchId = this.invInfoForm.controls.advanceSearchId.value! || 0;
            this.myInvoiceFilter.SupplierName = this.invInfoForm.controls.supplierName.value! || '';
            this.myInvoiceFilter.InvoiceNo = this.invInfoForm.controls.invoiceNo.value! || '';
            this.myInvoiceFilter.PONo  = this.invInfoForm.controls.poNo.value! || '';
            this.myInvoiceFilter.PaymentTerm  = this.invInfoForm.controls.paymentTerm.value! || '';
            this.myInvoiceFilter.SupplierNo = this.invInfoForm.controls.supplierNo.value! || '';
            this.myInvoiceFilter.SuppABN = this.invInfoForm.controls.suppABN.value! || '';
            this.myInvoiceFilter.SuppBankAccount = this.invInfoForm.controls.suppBankAccount.value! || '';
            this.myInvoiceFilter.EntityProfileID = this.invInfoForm.controls.entityProfileID.value! || 0;
            this.myInvoiceFilter.GrNo = this.invInfoForm.controls.grNo.value! || '';
            this.myInvoiceFilter.DaystillDue = this.invInfoForm.controls.daysTillDue.value! || 0;
            this.myInvoiceFilter.NetAmount = this.invInfoForm.controls.netAmount.value! || 0;
            this.myInvoiceFilter.TaxCodeID = this.invInfoForm.controls.taxCodeID.value! || 0;
            this.myInvoiceFilter.TaxAmount = this.invInfoForm.controls.taxAmount.value! || 0;
            this.myInvoiceFilter.Currency = this.invInfoForm.controls.currency.value! || '';
            this.myInvoiceFilter.TotalAmount = this.invInfoForm.controls.totalAmount.value! || 0;
            this.myInvoiceFilter.InvRoutingFlowName = this.invInfoForm.controls.invRoutingFlowName.value! || '';
            this.myInvoiceFilter.NextRole = this.invInfoForm.controls.nextRole.value! || '';
            this.myInvoiceFilter.Keyword = this.invInfoForm.controls.keyword.value! || '';
            this.myInvoiceFilter.MapID = this.invInfoForm.controls.mapID.value! || '';
            this.myInvoiceFilter.InvoiceID = this.invInfoForm.controls.invoiceID.value! || '';
            this.myInvoiceFilter.AdvanceSearchId = this.invInfoForm.controls.advanceSearchId.value! || 0;

            const invoicedaterage = this.invInfoForm.controls.dateRangeInvoiceDate.value;

            if (invoicedaterage && invoicedaterage.length === 2) {
              this.myInvoiceFilter.StartInvoiceDate = invoicedaterage[0].toDateString();
              this.myInvoiceFilter.EndInvoiceDate = invoicedaterage[1].toDateString();
            }

            const duedatedaterage = this.invInfoForm.controls.dateRangeDueDate.value;

            if (duedatedaterage && duedatedaterage.length === 2) {
              this.myInvoiceFilter.StartDueDate = duedatedaterage[0].toDateString();
              this.myInvoiceFilter.EndDueDate = duedatedaterage[1].toDateString();
            }

            const scandaterage = this.invInfoForm.controls.dateRangeScanDate.value;

            if (scandaterage && scandaterage.length === 2) {
              this.myInvoiceFilter.StartScanDate = scandaterage[0].toDateString();
              this.myInvoiceFilter.EndDueDate = scandaterage[1].toDateString();
            }

        this.myInvoiceFilter.FormName = this.formName;


    }

    
    //#endregion 
    //#region Resuable Function
    get f() {
    return this.invInfoForm.controls;
    }

    private initiliazeDropdown() {
    this.invDetailService.getDropdownOptions().subscribe({
      next: (dropdown) => {
        this.invInfoDropdown = dropdown;
      },
    });
    this.entityOptions$.pipe(takeUntil(this.destroy$)).subscribe((options) => {
      this.entityOptions = options;
    });
    this.taxCodeLookUpOptions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((options) => {
        this.taxCodeOptions = options;
      });

      this.invDetailService.getDropdownOptions().subscribe({
        next: (dropdown) => {
          this.invInfoDropdown = dropdown;
        },
      });

    }

    private normalizeBooleanFlag(value: any): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (['true', 'yes', '1'].includes(normalized)) {
        return true;
      }
      if (['false', 'no', '0'].includes(normalized)) {
        return false;
      }
    }

    if (typeof value === 'number') {
      return value === 1;
    }

    return false;
    }
    //#endregion
    //#region Supplier Information Accordion
    assignSupplier() {
    const ref: DynamicDialogRef = this.dialogService.open(
      SelectTableComponent,
      {
        header: 'Supplier Lookup',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        modal: true,
        closable: true,
        data: {
          multiple: false,
          columns: this.gridService.supplierSelectTableGrid(),
          data$: this.supplierDataList$,
          totalRecords$: this.supplierTotalRecord$,
          selectedRows: this.selectedSupplier ? [this.selectedSupplier] : [],
          rowDisablePredicate: (row: InvSearchSupplierDto) => !row?.isActive,
          onSearch: (filters: any) => {
            const query: InvSupplierLookUpQuery = {
              ...filters,
            };
            this.searchSupplier(query);
          },
        },
      }
    );

    ref.onClose.subscribe((selected) => {
      if (selected && selected.length > 0) {
        this.selectedSupplier = selected[0];
        if (!this.selectedSupplier?.isActive) {
          return;
        }
        this.f['supplierInfoID'].setValue(
          this.selectedSupplier?.supplierInfoID ?? null
        );
        this.f['suppABN'].setValue(
          this.selectedSupplier?.supplierTaxID ?? null
        );
        this.f['supplierNo'].setValue(
          this.selectedSupplier?.supplierID ?? null
        );
        this.f['supplierName'].setValue(
          this.selectedSupplier?.supplierName ?? null
        );     
      }
    });
    }

    searchSupplier(searchQuery: InvSupplierLookUpQuery) {
    this.lookOptionService
      .invSearchSupplierLookUp(searchQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.supplierData = res.responseData?.data ?? [];
            this.supplierTotalRecords = res.responseData?.totalCount ?? 0;
            // Push new data to the modal table
            this.supplierDataList$.next(this.supplierData);
            this.supplierTotalRecord$.next(this.supplierTotalRecords);
          }
        },
        error: () => {},
      });
    }
    //#endregion
    //#region  Invoice Detail Accordion
    assignPurchaseOrder(): void {
    const initialQuery = this.buildPurchaseOrderGridQuery({
      pageNumber: 1,
      pageSize: 5,
    });
    this.searchPurchaseOrders(initialQuery);

    const ref: DynamicDialogRef = this.dialogService.open(
      SelectTableComponent,
      {
        header: 'Purchase Order Lookup',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        modal: true,
        closable: true,
        data: {
          multiple: false,
          columns: this.gridService.poSelectTableGrid(),
          data$: this.purchaseOrderDataList$,
          totalRecords$: this.purchaseOrderTotalRecord$,
          selectedRows: this.selectedPurchaseOrder
            ? [this.selectedPurchaseOrder]
            : [],
          rowDisablePredicate: (row: POSearchDto) =>
            !this.normalizeBooleanFlag(row?.isActive),
          onSearch: (filters: any) => {
            const query = this.buildPurchaseOrderGridQuery(filters);
            this.searchPurchaseOrders(query);
          },
        },
      }
    );

    ref.onClose.subscribe((selected) => {
      const purchaseOrder = Array.isArray(selected)
        ? selected?.[0]
        : selected;
      if (!purchaseOrder) {
        return;
      }

      if (!this.normalizeBooleanFlag(purchaseOrder.isActive)) {
        return;
      }

      this.selectedPurchaseOrder = {
        ...purchaseOrder,
        isActive: this.normalizeBooleanFlag(purchaseOrder.isActive),
      };
      this.f['poNo'].setValue(purchaseOrder.poNo ?? '');
    });

    }

    private searchPurchaseOrders(searchQuery: POSearchQuery): void {
    this.purchaseOrderService
      .poSearch(searchQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          if (!res.isSuccess || !res.responseData) {
            this.purchaseOrderDataList$.next([]);
            this.purchaseOrderTotalRecord$.next(0);
            return;
          }

          const mappedData =
            res.responseData.data?.map((po) => ({
              ...po,
              isActive: this.normalizeBooleanFlag(po.isActive),
            })) ?? [];

          this.purchaseOrderData = mappedData;
          this.purchaseOrderTotalRecords = res.responseData.totalCount ?? 0;
          this.purchaseOrderDataList$.next(mappedData);
          this.purchaseOrderTotalRecord$.next(
            this.purchaseOrderTotalRecords
          );
        },
        error: () => {
          this.purchaseOrderDataList$.next([]);
          this.purchaseOrderTotalRecord$.next(0);
        },
      });
    }

    private buildPurchaseOrderGridQuery(filters: any = {}): POSearchQuery {
    const normalizedActive =
      filters.isActive === undefined || filters.isActive === null
        ? null
        : this.normalizeBooleanFlag(filters.isActive);

    const supplierRaw =
      filters.supplierName ??
      filters.supplier ??
      (filters.supplierID !== undefined && filters.supplierID !== null
        ? String(filters.supplierID)
        : null);

    const supplierValue =
      typeof supplierRaw === 'string' ? supplierRaw.trim() : supplierRaw;

    return {
      PONo: filters.poNo?.trim() ?? null,
      EntityName: filters.entityName?.trim() ?? null,
      SupplierName: supplierValue ? supplierValue : null,
      IsActive: normalizedActive,
      PageNumber: filters.pageNumber ?? 1,
      PageSize: filters.pageSize ?? 10,
      SortField: filters.sortField,
      SortOrder: filters.sortOrder,
    };
    }


    assignGoodReceiptNo(): void {
    const initialQuery = this.buildGoodReceiptGridQuery({
      pageNumber: 1,
      pageSize: 5,
    });
    this.searchGoodReceiptNos(initialQuery);

    const ref: DynamicDialogRef = this.dialogService.open(
      SelectTableComponent,
      {
        header: 'Good Receipt No Lookup',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        modal: true,
        closable: true,
        data: {
          multiple: false,
          columns: this.gridService.GoodReceiptSelectTableGrid(),
          data$: this.goodsReceiptDataList$,
          totalRecords$: this.goodsReceiptTotalRecord$,
          selectedRows: this.selectedGoodsReceipt
            ? [this.selectedGoodsReceipt]
            : [],
          rowDisablePredicate: (row: SearchGoodsReceiptLookupDto) =>
            !this.normalizeBooleanFlag(row?.active),
          onSearch: (filters: any) => {
            const query = this.buildGoodReceiptGridQuery(filters);
            this.searchGoodReceiptNos(query);
          },
        },
      }
    );

    ref.onClose.subscribe((selected) => {
      const goodReceiptNo = Array.isArray(selected)
        ? selected?.[0]
        : selected;
      if (!goodReceiptNo) {
        return;
      }

      if (!this.normalizeBooleanFlag(goodReceiptNo.isActive)) {
        return;
      }

      this.selectedGoodsReceipt = {
        ...goodReceiptNo,
        isActive: this.normalizeBooleanFlag(goodReceiptNo.isActive),
      };
      this.f['grNo'].setValue(goodReceiptNo.goodsReceiptNumber ?? '');
    });
    }

    private searchGoodReceiptNos(searchQuery: SearchGoodsReceiptQuery): void {
    this.invDetailService
      .goodReceiptNoSearch(searchQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          if (!res.isSuccess || !res.responseData) {
            this.goodsReceiptDataList$.next([]);
            this.goodsReceiptTotalRecord$.next(0);
            return;
          }

          const mappedData =
            res.responseData.data?.map((grNo) => ({
              ...grNo,
              isActive: this.normalizeBooleanFlag(grNo.active),
              deliveryDate: grNo.deliveryDate ?? null,
            })) ?? [];

          this.goodsReceiptData = mappedData;
          this.goodsReceiptTotalRecords = res.responseData.totalCount ?? 0;
          this.goodsReceiptDataList$.next(mappedData);
          this.goodsReceiptTotalRecord$.next(
            this.goodsReceiptTotalRecords
          );
        },
        error: () => {
          this.goodsReceiptDataList$.next([]);
          this.goodsReceiptTotalRecord$.next(0);
        },
      });
    }



    private buildGoodReceiptGridQuery(filters: any = {}): SearchGoodsReceiptQuery {
    const normalizedActive =
      filters.active === undefined || filters.active === null
        ? null
        : this.normalizeBooleanFlag(filters.active);

    const supplierRaw =
      filters.supplierName ??
      filters.supplier ??
      (filters.supplierID !== undefined && filters.supplierID !== null
        ? String(filters.supplierID)
        : null);

    const supplierValue =
      typeof supplierRaw === 'string' ? supplierRaw.trim() : supplierRaw;

    const deliveryDateFrom = filters.deliveryDateFrom
      ? formatToIsoDate(filters.deliveryDateFrom)  // <-- convert Date to string
      : null;
    const deliveryDateTo = filters.deliveryDateTo
      ? formatToIsoDate(filters.deliveryDateTo)    // <-- convert Date to string
      : null;

    return {
      entity: filters.entityName?.trim() ?? null,
      supplier: supplierValue ? supplierValue : null,
      goodsReceiptNumber: filters.goodsReceiptNumber?.trim() ?? null,
      active: normalizedActive,
      deliveryDateFrom, 
      deliveryDateTo, 
      PageNumber: filters.pageNumber ?? 1,
      PageSize: filters.pageSize ?? 10,
      SortField: filters.sortField,
      SortOrder: filters.sortOrder,
    };
    }
    //#endregion
    //#region Invoice Amounts Accordion
    onAmountsChange() {
      let amounts: AmountDto = this.amountValues();
      this.amounts.emit({ ...amounts });
    }

    private amountValues(): AmountDto {
      return {
        netAmount: this.f['netAmount'].value!,
        taxAmount: this.f['taxAmount'].value!,
        totalAmount: this.f['totalAmount'].value!,
      };
    }
    //#endregion
    //#region  Workflow Routing Accordion
    assignRoutingFlow(){
      const ref: DynamicDialogRef = this.dialogService.open(
        SelectTableComponent,
        {
          header: 'Routing Flow Lookup',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          modal: true,
          closable: true,
          data:{
            multiple: false,
            columns: this.gridService.invoiceRoutingSelectTableGrid(),
            data$: this.routingFlowDataList$,
            totalRecords$: this.routingFlowTotalRecords$,
            selectedRows: this.selectedRoutingFlow ? [this.selectedRoutingFlow] : [],
            rowDisablePredicate: (row: RoutingFlowLookupDto) => !row?.isActive,
            onSearch: (filter: any) => {
              const query: RoutingFlowLookupQuery ={
                ...filter,
              };
              this.searchRoutingFlow(query)
            }
          }
        }
      );
  
      ref.onClose.subscribe((selected) => {
        const routingFlow = Array.isArray(selected) ? selected?.[0] : selected;
        if(!routingFlow){
          return;
        }
        this.selectedRoutingFlow = routingFlow;
        
        this.f['invRoutingFlowID'].setValue(routingFlow.invRoutingFlowID);
        this.f['invRoutingFlowName'].setValue(routingFlow.invRoutingFlowName);
      });
    }

    searchRoutingFlow(searchQuery: RoutingFlowLookupQuery){
      this.lookOptionService
      .routingFlowSearchLookUp(searchQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          this.routingFlowData = res.responseData?.data ?? [];
          this.routingFlowTotalRecords = res.responseData?.totalCount ?? 0;
  
          this.routingFlowDataList$.next(this.routingFlowData);
          this.routingFlowTotalRecords$.next(this.routingFlowTotalRecords);
          
        },
        error: () => {},
      });
    }

    
  assignKeyword(): void {
    const initialQuery = this.buildKeywordGridQuery({
      pageNumber: 1,
      pageSize: 5,
    });
    this.searchKeyword(initialQuery);

    const ref: DynamicDialogRef = this.dialogService.open(
      SelectTableComponent,
      {
        header: 'Keyword Lookup',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        modal: true,
        closable: true,
        data: {
          multiple: false,
          columns: this.gridService.keywordSelectTableGrid(),
          data$: this.keywordDataList$,
          totalRecords$: this.keywordTotalRecord$,
          selectedRows: this.selectedKeyword ? [this.selectedKeyword] : [],
          rowDisablePredicate: (row: Keyword) => !row?.isActive,
          onSearch: (filters: any) => {
            const query = this.buildKeywordGridQuery(filters);
            this.searchKeyword(query);
          },
        },
      }
    );

    ref.onClose.subscribe((selected) => {
      const keyword = Array.isArray(selected) ? selected?.[0] : selected;
      if (!keyword) {
        return;
      }
      
      this.selectedKeyword = keyword;
      this.f['keyword'].setValue(keyword.keywordName);
      this.f['keywordID'].setValue(keyword.keywordID);
      if (this.f['invRoutingFlowName'].value === '') {
          //this.f['invRoutingFlowID'].setValue(keyword.invoiceRoutingFlowID);
          //this.f['invRoutingFlowName'].setValue(keyword.invoiceRoutingFlowName);
      }
    });
  }

  private buildKeywordGridQuery(filters: any = {}): KeywordGridQuery {
    const normalizedActive =
      filters.isActive === undefined || filters.isActive === null
        ? null
        : filters.isActive;

    return {
      keywordName: filters.keywordName?.trim() ?? '',
      entityName: filters.entityName?.trim() ?? '',
      invoiceRoutingFlowName: filters.invoiceRoutingFlowName?.trim() ?? '',
      isActive: normalizedActive,
      pageNumber: filters.pageNumber ?? 1,
      pageSize: filters.pageSize ?? 10,
      sortField: filters.sortField,
      sortOrder: filters.sortOrder,
    };
  }
  private searchKeyword(searchQuery: KeywordGridQuery): void {
    this.keywordService
      .getKeywords(searchQuery)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          if (!res.isSuccess || !res.responseData) {
            return;
          }
          this.keywordData = res.responseData.data ?? [];
          this.keywordTotalRecords = res.responseData.totalCount ?? 0;
          this.keywordDataList$.next(this.keywordData);
          this.keywordTotalRecord$.next(this.keywordTotalRecords);
        },
        error: () => {},
      });
  }

    //#endregion

    //#region search
      onSearch() {
      this.transferFilter();

      if(this.invInfoForm.controls.isSaveAsTemplate.value){
        this.updateAdvanceSearch();
      }

      this.saveToLocalStorange();

      this.searchEvent.emitReloadSubject(this.formName);

    }


    searchMyInvoice(query: MyInvoiceSearchQuery) {

      var url = '';

      
    switch(this.formName) {
      case ADVANCESEARCH_CONSTANT.FORMNAME.MYINVOICEQUEUE : 
        url = INV_ENPOINT.GET_INV_MYINVOICE_SEARCH;
      break;
      case ADVANCESEARCH_CONSTANT.FORMNAME.REJECTIONQUEUE : 
        url = INV_ENPOINT.GET_INV_REJECTED_SEARCH;
      break;
      case ADVANCESEARCH_CONSTANT.FORMNAME.EXCEPTIONQUEUE : 
        url = INV_ENPOINT.GET_INV_EXCEPTION_SEARCH;
      break;
      case ADVANCESEARCH_CONSTANT.FORMNAME.ARCHIVEINVOICE : 
        url = INV_ENPOINT.GET_INV_ARCHIVE_SEARCH;
      break;
    }

      this.invDetailService
        .invoiceDynamicAdvanceSearch(query,url)
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
    //#endregion

   //#region  Save Template
   SaveAsTemplate(event: any) {
    console.log("Checkbox changed:", event.checked);

    const control = this.invInfoForm.get('isSaveAsTemplate');
    control?.setValue(event.checked);
    // this is add
    if(event.checked)
    {
      this.addNewAdvanceSearch();
    }
    else{
      this.removeAdvanceSearch();
    }


  }


  private addNewAdvanceSearch() {

    this.transferFilter();

    this.advanceSearchService.createAdvanceSearch(this.myInvoiceFilter).subscribe({
      next: (response) => {
        this.invInfoForm.controls.advanceSearchId.setValue(response.responseData!);
        this.myInvoiceFilter.AdvanceSearchId = response.responseData!;
      },
      error: (error: ResponseResult<boolean>) => {

      },
      complete: () => {
        
      }
    });
  }

  private removeAdvanceSearch(){


    console.log(this.myInvoiceFilter.AdvanceSearchId!);
    this.advanceSearchService.deleteAdvanceSearch(this.myInvoiceFilter.AdvanceSearchId!).subscribe({
      next: (response) => {
        if(response.isSuccess){
          this.clear();
        }
      },
      error: (error: ResponseResult<boolean>) => {

      },
      complete: () => {
        
      }
  });
//#endregion
  }

  private saveToLocalStorange(){
    var local_storage = '';

    switch(this.formName) {
      case ADVANCESEARCH_CONSTANT.FORMNAME.MYINVOICEQUEUE : 
        local_storage = ADVANCESEARCH_CONSTANT.LOCALSTORAGE.MYINVOICEQUEUE;
      break;
      case ADVANCESEARCH_CONSTANT.FORMNAME.REJECTIONQUEUE : 
        local_storage = ADVANCESEARCH_CONSTANT.LOCALSTORAGE.REJECTIONQUEUE;
      break;
      case ADVANCESEARCH_CONSTANT.FORMNAME.EXCEPTIONQUEUE : 
        local_storage = ADVANCESEARCH_CONSTANT.LOCALSTORAGE.EXCEPTIONQUEUE;
      break;
      case ADVANCESEARCH_CONSTANT.FORMNAME.ARCHIVEINVOICE : 
        local_storage = ADVANCESEARCH_CONSTANT.LOCALSTORAGE.ARCHIVEINVOICE;
      break;
    }

    localStorage.setItem(local_storage,JSON.stringify(this.myInvoiceFilter));
  }

  private updateAdvanceSearch(){
    this.transferFilter();
    this.advanceSearchService.updateAdvanceSearch(this.myInvoiceFilter).subscribe({
      next: (response) => {
        this.invInfoForm.controls.advanceSearchId.setValue(response.responseData!);
        this.myInvoiceFilter.AdvanceSearchId = response.responseData!;
      },
      error: (error: ResponseResult<boolean>) => {

      },
      complete: () => {
        
      }
    });

  }

  private clear () {
    localStorage.removeItem(ADVANCESEARCH_CONSTANT.LOCALSTORAGE.MYINVOICEQUEUE);
    this.invInfoForm.reset();
    this.transferFilter();
    this.searchEvent.emitReloadSubject(this.formName);
  }

  onClear () {

    if(this.myInvoiceFilter.AdvanceSearchId! > 0){
      this.removeAdvanceSearch();
    }else{
      this.clear();
    }

  }

  onCancel(){
    this.dialogref.close();
  }

}

