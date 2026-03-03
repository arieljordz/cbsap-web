import { CommonModule, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResponseResult } from '@core/model/common';
import {
  AmountDto,
  InvInfoDto,
} from '@core/model/invoicing/invoice/invoice-info.dto';
import {
  createFreeFieldFormGroup,
  createInvInfoForm,
  createSpareAmountFormGroup,
  FreeFieldsFormGroup,
  InvInfoFormGroup,
  SpareAmountFormGroup,
} from '@core/model/invoicing/invoice/invoice-info.forms';
import {
  InvSearchSupplierDto,
  InvSupplierLookUpQuery,
} from '@core/model/invoicing/invoicing.index';
import { Keyword, KeywordGridQuery } from '@core/model/keyword-management';
import { POSearchDto } from '@core/model/purchase-order/po-search.dto';
import { POSearchQuery } from '@core/model/purchase-order/po.query';
import {
  GridService,
  KeywordService,
  LookupOptionsService,
  LookUpsService,
  ValidationService,
} from '@core/services';
import { InvoiceDetailService } from '@core/services/invoicing/invoice-detail.service';
import { PurchaseOrderService } from '@core/services/purchase-order/purchase-order.service';
import { getErrorMessage } from '@core/utils/shared-utils';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { SelectTableComponent } from '@shared/popup/select-table/select-table.component';
import { SelectItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  combineLatest,
  of,
  Subject,
  switchMap,
  takeUntil,
  startWith,
  distinctUntilChanged,
  map,
  throwError,
} from 'rxjs';
import { InvoiceValidationMessageComponent } from '../invoice-validation-message/invoice-validation-message.component';

@Component({
  selector: 'app-invoice-info',
  standalone: true,
  providers: [DialogService],
  imports: [
    PrimeImportsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgIf,
    InvoiceValidationMessageComponent,
  ],
  templateUrl: './invoice-info.component.html',
  styleUrl: './invoice-info.component.scss',
})
export class InvoiceInfoComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();
  invInfoForm!: InvInfoFormGroup;
  
  freeFields: { value: string }[] = [];
  spareAmountFields: { value: string }[] = [];
  routingFlowName:string | null = null;
  

  invInfoDropdown: Record<string, SelectItem[]> = {};
  entityOptions?: SelectItem[] = [];
  taxCodeOptions?: SelectItem[] = [];
  focusStates: { [key: string]: boolean } = {};

  invoiceID: number = 0;
   @Output() invoiceDataLoaded = new EventEmitter<InvInfoDto>();

  @Input() messages: string[] = [];
  @Input() invoiceValidationHeader: string = '';
  @Input() invoiceId?: number;

  readonly entityOptions$ = this.lookUpOptionService.entityOptions$;
  readonly taxCodeLookUpOptions$ =
    this.lookUpOptionService.taxCodeLookUpOptions$;

  amountDto: AmountDto = {
    netAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
  };

  @Output() amounts = new EventEmitter<AmountDto>();
  private destroySubject: Subject<void> = new Subject();
  private supplierDataList$ = new BehaviorSubject<any[]>([]);
  private supplierTotalRecord$ = new BehaviorSubject<number>(0);
  supplierTotalRecords = 0;
  supplierData: InvSearchSupplierDto[] = [];
  selectedSupplier?: InvSearchSupplierDto;
  private keywordDataList$ = new BehaviorSubject<Keyword[]>([]);
  private keywordTotalRecord$ = new BehaviorSubject<number>(0);
  keywordTotalRecords = 0;
  keywordData: Keyword[] = [];
  selectedKeyword?: Keyword;
  private purchaseOrderDataList$ = new BehaviorSubject<POSearchDto[]>([]);
  private purchaseOrderTotalRecord$ = new BehaviorSubject<number>(0);
  purchaseOrderTotalRecords = 0;
  purchaseOrderData: POSearchDto[] = [];
  selectedPurchaseOrder?: POSearchDto;
  daysTillDue:number | null=null;

  constructor(
    private lookUpOptionService: LookupOptionsService,
    private invDetailService: InvoiceDetailService,
    private validationService: ValidationService,
    private dialogService: DialogService,
    private activeRoute: ActivatedRoute,
    private lookOptionService: LookUpsService,
    private gridService: GridService,
    private keywordService: KeywordService,
    private purchaseOrderService: PurchaseOrderService
  ) {
    this.invInfoForm = createInvInfoForm();
    this.invoiceID = Number(this.activeRoute.snapshot.params['id'] ?? 0);
  }

     

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.initiliazeDropdown();
    const hydratedInvoiceId = this.invoiceId ?? this.invoiceID;
    if (hydratedInvoiceId) {
      this.invoiceID = hydratedInvoiceId;
      this.loadInvoiceData(this.invoiceID);
    }

    this.f['dueDate'].valueChanges
      .pipe(
        startWith(this.f['dueDate'].value),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.computeDaysTillDue();
      });
  }


  computeDaysTillDue(){    
    const dueDate = this.f['dueDate'].value as Date | null;
    
    if (!dueDate) {
      this.daysTillDue = null;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDateNormalized = new Date(dueDate!);
    dueDateNormalized.setHours(0, 0, 0, 0);
    const timeDiff = dueDateNormalized.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (daysDiff < 0) {
      this.daysTillDue = 0;
    }
    else {
      this.daysTillDue = daysDiff;
    }
  }


  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoiceId'] && !changes['invoiceId'].firstChange) {
      const newId = Number(changes['invoiceId'].currentValue ?? 0);
      if (!Number.isNaN(newId) && newId > 0 && newId !== this.invoiceID) {
        this.invoiceID = newId;
        this.resetFormState();
        this.loadInvoiceData(this.invoiceID);
      }            
    }    
  }
  

  private resetFormState(): void {
    this.invInfoForm = createInvInfoForm();
    this.freeFields = [];
    this.spareAmountFields = [];
    this.selectedSupplier = undefined;
    this.selectedKeyword = undefined;
    this.selectedPurchaseOrder = undefined;
    this.supplierDataList$.next([]);
    this.supplierTotalRecord$.next(0);
    this.keywordDataList$.next([]);
    this.keywordTotalRecord$.next(0);
    this.purchaseOrderDataList$.next([]);
    this.purchaseOrderTotalRecord$.next(0);

    

  }

  /** Look up action */
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
        this.f['suppName'].setValue(
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
            console.log(this.supplierData);
            // Push new data to the modal table
            this.supplierDataList$.next(this.supplierData);
            this.supplierTotalRecord$.next(this.supplierTotalRecords);
          }
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
    });
  }

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
      Supplier: supplierValue ? supplierValue : null,
      IsActive: normalizedActive,
      PageNumber: filters.pageNumber ?? 1,
      PageSize: filters.pageSize ?? 10,
      SortField: filters.sortField,
      SortOrder: filters.sortOrder,
    };
  }

  /** API CALLS  */
  private loadInvoiceData(invoiceID: number) {
    this.invDetailService
      .getInvoiceByInvID(invoiceID)
      .pipe(
        switchMap((response: ResponseResult<InvInfoDto>) => {
          if (response?.isSuccess && response.responseData) {
            const invoice = response.responseData;
            this.routingFlowName = invoice.routingFlowName;
            return combineLatest([
              of(invoice),
              this.entityOptions$,
              this.invDetailService.getDropdownOptions(),
              this.taxCodeLookUpOptions$

            ]);
          } else {
            // handle error, or return empty fallback
            return throwError(() => new Error('Failed to fetch invoice'));
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(([invoice, entityOptions, dropdown, taxCodeLookUpOptions]) => {
        this.invInfoForm.patchValue({
          ...invoice,
          invoiceDate: invoice.invoiceDate
            ? new Date(invoice.invoiceDate)
            : null,
          dueDate: invoice.dueDate ? new Date(invoice.dueDate) : null,
          scanDate: invoice.scanDate ? new Date(invoice.invoiceDate) : null,
        });

        this.entityOptions = entityOptions;
        this.taxCodeOptions = taxCodeLookUpOptions;
        this.invInfoDropdown = {
          currencies: dropdown.currencies,
          paymentTerms: dropdown.paymentTerms,
        };
       

       this.invoiceDataLoaded.emit(invoice);

        this.formFreeFields.clear();
        invoice?.freeFields.forEach((freeField) => {
          this.formFreeFields.push(createFreeFieldFormGroup(freeField));
        });
        this.formSpareAmountFields.clear();
        invoice?.spareAmounts.forEach((freeField) => {
          this.formSpareAmountFields.push(
            createSpareAmountFormGroup(freeField)
          );
        });

        //
        let amounts: AmountDto = this.amountValues();
        this.amounts.emit({ ...amounts });
      });
  }

  /** Free Field and Spare Amount Action */
  onAddFreeField() {
    //  this.freeFields.push({ value: '' });
    const index = this.formFreeFields.length + 1;
    const key = `FreeField${index}`;
    this.formFreeFields.push(
      createFreeFieldFormGroup({ fieldKey: key, fieldValue: '' })
    );
  }

  onRemoveFreeField(index: number) {
    //this.freeFields.splice(index, 1);
    this.formFreeFields.removeAt(index);
  }
  onAddSpareAmountField() {
    // this.spareAmountFields.push({ value: '' });
    const index = this.formSpareAmountFields.length + 1;
    this.formSpareAmountFields.push(
      createSpareAmountFormGroup({
        fieldKey: `Spare Amount ${index}`,
        fieldValue: '',
      })
    );
  }

  onRemoveSpareAmountField(index: number) {
    // this.spareAmountFields.splice(index, 1);
    this.formSpareAmountFields.removeAt(index);
  }

  /** initialize dropdown */
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

  /**Reactive Form Init */
  get f() {
    return this.invInfoForm.controls;
  }

  get formFreeFields(): FormArray<FreeFieldsFormGroup> {
    return this.invInfoForm.get('freeFields') as FormArray<FreeFieldsFormGroup>;
  }
  get formSpareAmountFields(): FormArray<SpareAmountFormGroup> {
    return this.invInfoForm.get(
      'spareAmount'
    ) as FormArray<SpareAmountFormGroup>;
  }
  groupName(group: AbstractControl): string {
    return Object.keys((group as FormGroup).controls)[0];
  }

  /** Validation Fields  */
  readonly getErrorMessage = (
    control: AbstractControl | null,
    fieldName: string
  ): string | null =>
    getErrorMessage(this.validationService, control, fieldName);

  onFocusChange(field: string, isFocused: boolean) {
    this.focusStates[field] = isFocused;
  }

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
}
