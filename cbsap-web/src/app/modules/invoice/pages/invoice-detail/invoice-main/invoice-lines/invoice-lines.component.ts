import { CommonModule, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageSeverity } from '@core/constants';
import { InvoiceQueue, InvoiceStatusEnum } from '@core/enums';
import { ResponseResult } from '@core/model/common';
import { InvAllocEntryDto } from '@core/model/invoicing/invoice/invoice-allocation-lines.dto';
import {
  createInvAllocationlineForm,
  InvAllocationLineFormGroup,
} from '@core/model/invoicing/invoice/invoice-allocation-lines.forms';
import { AmountDto } from '@core/model/invoicing/invoicing.index';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { AccountSearchComponent } from '@shared/popup/account-search/account-search.component';
import { SelectItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import {
  combineLatest,
  of,
  Subject,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import {
  AlertService,
  InvoiceDetailService,
  InvoiceFormService,
  LookupOptionsService,
} from 'src/app/core/services';

@Component({
  selector: 'app-invoice-lines',
  standalone: true,
  providers: [DialogService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeImportsModule,
    NgIf,
  ],
  templateUrl: './invoice-lines.component.html',
  styleUrl: './invoice-lines.component.scss',
})
export class InvoiceLinesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() invoiceAllocationItems: InvAllocEntryDto[] = [];
  @Output() itemsChange = new EventEmitter<InvAllocEntryDto[]>();
  @Input() amounts: AmountDto | null = null;
  private hasInitialized = false;

  @Input()
  set invoiceId(value: number | null) {
    if (value === null || value === undefined) {
      return;
    }

    if (value === this.invoiceID) {
      return;
    }

    this.invoiceID = value;

    if (this.hasInitialized) {
      this.resetInvoiceLinesState();
      this.loadInvoiceData(this.invoiceID);
      this.getInvoiceStatus();
    }
  }

  invAllocForms: InvAllocationLineFormGroup[] = [];
  editingRowIndex: number | null = null;
  invoiceID: number = 0;
  @ViewChild('table') table: Table | undefined;
  queueroute?: InvoiceQueue | null = null;
  isAddAllocationLineVisible: boolean = false;

  taxCodeOptions?: SelectItem[] = [];

  accountOptions?: SelectItem[] = [];
  readonly taxCodeLookUpOptions$ =
    this.lookUpOptionService.taxCodeLookUpOptions$;

  readonly accountLookUpOptions$ =
    this.lookUpOptionService.accountsLookupOptions$;

  constructor(
    private lookUpOptionService: LookupOptionsService,
    private invDetailService: InvoiceDetailService,
    private message: AlertService,
    private activeRoute: ActivatedRoute,
    private invFormService: InvoiceFormService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private dialogService: DialogService
  ) {
    this.invoiceID = Number(this.activeRoute.snapshot.params['id'] ?? 0);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.buildInvAlocationForm();
    this.getInvoiceStatus();
    this.taxCodeLookUpOptions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((options) => {
        this.taxCodeOptions = options;
      });

    this.accountLookUpOptions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((options) => {
        this.accountOptions = options;
      });

    this.invFormService.closePODialog$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadInvoiceData(this.invoiceID);
      });
    this.loadInvoiceData(this.invoiceID);
    this.hasInitialized = true;
  }

  /** API CALLS  */
  private loadInvoiceData(invoiceID: number) {
    this.invDetailService
      .getInvoiceAllocationByInvID(invoiceID)
      .pipe(
        switchMap((response: ResponseResult<InvAllocEntryDto[]>) => {
          if (response?.isSuccess && response.responseData) {
            const allocationLine = response.responseData;

            return combineLatest([of(allocationLine)]);
          } else {
            // handle error, or return empty fallback
            return throwError(() => new Error('Failed to fetch invoice'));
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(([allocationLine]) => {
        this.invoiceAllocationItems = allocationLine;
        this.invAllocForms = this.invoiceAllocationItems.map((items) =>
          createInvAllocationlineForm(items)
        );
      });
  }

  getInvoiceStatus() {
    this.invDetailService.getInvoiceStatus(this.invoiceID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.isAddAllocationLineVisible =
            ![
              InvoiceQueue.ArchiveQueue,
              InvoiceQueue.ExportedQueue,
              InvoiceQueue.ReadyForExportQueue,
            ].includes(response.responseData?.queue!) &&
            ![
              InvoiceStatusEnum.ReadyForExport,
              InvoiceStatusEnum.Archived,
              InvoiceStatusEnum.Exported,
            ].includes(response.responseData?.status!);
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Invoice Status ',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        //  this.closeDialog();
      },
    });
  }

  buildInvAlocationForm() {
    this.invAllocForms = this.invoiceAllocationItems.map((items) =>
      createInvAllocationlineForm(items)
    );
  }

  addAlocationRow() {
    let maxLineNo = this.invoiceAllocationItems.length
      ? Math.max(...this.invoiceAllocationItems.map((i) => i.lineNo ?? 0))
      : 0;

    const newLine: InvAllocEntryDto = {
      invAllocLineID: 0,
      invoiceID: this.invoiceID,
      lineNo: maxLineNo + 1,
      poNo: null,
      poLineNo: null,
      account: null,
      accountDisplay: null,
      qty: 0,
      lineDescription: null,
      note: null,
      lineNetAmount: 0,
      taxCodeID: null,
      lineTaxAmount: 0,
      lineAmount: 0,
      isFromPOMatching: false,
    };


    this.invoiceAllocationItems = [...this.invoiceAllocationItems, newLine];
    this.invAllocForms.push(createInvAllocationlineForm(newLine));
    this.itemsChange.emit(this.invoiceAllocationItems);

    setTimeout(() => {
      this.editingRowIndex = this.invoiceAllocationItems.length - 1;
      this.ngZone.run(() => {
        this.table?.initRowEdit(newLine);
        this.focusFirstField(this.invoiceAllocationItems.length - 1);
        this.cdRef.detectChanges();
      });
    });
  }

  editAllocRow(index: number) {
    setTimeout(() =>
      this.focusFirstField(this.invoiceAllocationItems.length - 1)
    );

    this.editingRowIndex = index;
    const accountID = this.invAllocForms[index].getRawValue().account;
    const id = this.invAllocForms[index].getRawValue().invAllocLineID;
    const detail = this.accountOptions?.find((acc) => acc.value === accountID);
    this.invAllocForms[index].patchValue({
      account: detail?.value,
      accountDisplay: detail?.label,
      invAllocLineID: id
    });
  }

  saveRow(index: number) {
    const form = this.invAllocForms[index];
    const formValues = form.value;
    if (form.invalid) return;
    const values: InvAllocEntryDto = {
      invAllocLineID: formValues.invAllocLineID ?? 0,
      invoiceID: this.invoiceID,
      lineNo: formValues.lineNo ?? 0,
      poLineNo: formValues.poLineNo ?? null,
      poNo: formValues.poNo ?? null,
      account: formValues.account ?? null,
      accountDisplay: formValues.accountDisplay?.trim() ?? null,
      qty: formValues.qty ?? 0,
      lineDescription: formValues.lineDescription ?? null,
      note: formValues.note ?? null,
      lineNetAmount: formValues.lineNetAmount ?? 0,
      taxCodeID: formValues.taxCodeID ?? null,
      lineTaxAmount: formValues.lineTaxAmount ?? 0,
      lineAmount: formValues.lineAmount ?? 0,
      isFromPOMatching: formValues.isFromPOMatching ?? false,
    };

    if (values.invAllocLineID > 0) {
      this.updateAllocationLine(values);
    }
    else {
      this.addAllocationLine(index, values);
    }
    this.invoiceAllocationItems[index] = { ...values };
    this.itemsChange.emit(this.invoiceAllocationItems);
    this.editingRowIndex = null;

  }

  addAllocationLine(index: number, allocationLine: InvAllocEntryDto) {
    this.invDetailService
      .addAllocationLine(this.invoiceID, allocationLine)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((response: ResponseResult<number>) => {
        if (response.isSuccess) {

          this.loadInvoiceData(this.invoiceID);
        }
      });
  }

  updateAllocationLine(allocationLine: InvAllocEntryDto) {
    this.invDetailService
      .updateAllocationLine(this.invoiceID, allocationLine)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((response: ResponseResult<boolean>) => {
        if (response.isSuccess) {

        }
      });
  }

  cancelEdit(index: number) {
    this.invAllocForms[index].patchValue(this.invoiceAllocationItems[index]);
    this.editingRowIndex = null;
    if (this.invoiceAllocationItems[index].invAllocLineID === 0) {
      this.loadInvoiceData(this.invoiceID);
    }
  }

  deleteRow(index: number) {
    const allocItem = this.invoiceAllocationItems[index];
    const allocId = allocItem?.invAllocLineID ?? 0;

    // If the allocation line was saved previously, call API delete
    if (allocId > 0) {
      this.invDetailService
        .deleteAllocationLine(this.invoiceID, allocId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          if (response.isSuccess) {
            this.invoiceAllocationItems.splice(index, 1);
            this.invAllocForms.splice(index, 1);
            this.recalculateItemNos();
            this.invoiceAllocationItems = [...this.invoiceAllocationItems];
            this.itemsChange.emit(this.invoiceAllocationItems);

          } else {
            this.message.showToast(
              MessageSeverity.error.toString(),
              'Allocation Line Delete',
              response.messages?.[0] ?? 'Failed to delete allocation line',
              2000
            );
          }
        });
    } else {
      // Local-only (not persisted) - just remove from UI
      this.invoiceAllocationItems.splice(index, 1);
      this.invAllocForms.splice(index, 1);

      this.recalculateItemNos();
      this.invoiceAllocationItems = [...this.invoiceAllocationItems];
      this.itemsChange.emit(this.invoiceAllocationItems);
    }
  }

  get totalTaxAmount(): number {
    return this.invoiceAllocationItems.reduce(
      (sum, i) => sum + (i.lineTaxAmount || 0),
      0
    );
  }

  get totalNetAmount(): number {
    return this.invoiceAllocationItems.reduce(
      (sum, i) => sum + (i.lineNetAmount || 0),
      0
    );
  }
  get totalAmount(): number {
    return this.invoiceAllocationItems.reduce(
      (sum, i) => sum + (i.lineAmount || 0),
      0
    );
  }

  get differenceInNetAmount(): number {
    const headerNetAmount = this.amounts?.netAmount ?? 0;
    return Math.abs(this.totalNetAmount - headerNetAmount);
  }
  get differenceInTaxAmount(): number {
    const headerTaxAmount = this.amounts?.taxAmount ?? 0;
    return Math.abs(this.totalTaxAmount - headerTaxAmount);
  }

  get differenceInTotalAmount(): number {
    const headerTotalAmount = this.amounts?.totalAmount ?? 0;
    return Math.abs(this.totalAmount - headerTotalAmount);
  }

  get isNetAmountMatch(): boolean {
    const headerNetAmount = this.amounts?.netAmount ?? 0;
    return headerNetAmount !== this.totalNetAmount;
  }
  get isTaxAmountMatch(): boolean {
    const headerNetAmount = this.amounts?.taxAmount ?? 0;
    return headerNetAmount !== this.totalTaxAmount;
  }
  get isAmountMatch(): boolean {
    const headerNetAmount = this.amounts?.totalAmount ?? 0;
    return headerNetAmount !== this.totalAmount;
  }

  getTaxCodeLabel(id: string): string {
    const option = this.taxCodeOptions!.find((opt) => opt.value === id);
    return option ? option.label! : 'Select'; // fallback to ID if not found
  }

  private resetInvoiceLinesState(): void {
    this.invoiceAllocationItems = [];
    this.invAllocForms = [];
    this.itemsChange.emit(this.invoiceAllocationItems);
  }

  focusFirstField(index: number) {
    const input = document.querySelector(`#descPO-${index}`);
    (input as HTMLInputElement)?.focus();
  }
  recalculateItemNos() {
    this.invoiceAllocationItems.forEach((item, idx) => {
      item.lineNo = idx + 1;
      this.invAllocForms[idx].patchValue({ lineNo: item.lineNo });
    });
  }

  assignSupplier() { }

  /** Look up action */
  assignAccount(rowIndex: number) {
    const ref = this.dialogService.open(AccountSearchComponent, {
      header: 'Search Account ',
      modal: true,
      closable: true,
      width: '60rem',
      style: { minHeight: '200px' },
      dismissableMask: true,
      baseZIndex: 1200,
    });

    ref.onClose.subscribe((account: any) => {
      if (account) {
        this.invoiceAllocationItems[rowIndex].account = account;

        this.invAllocForms[rowIndex].patchValue({
          account: account.accountID,
          accountDisplay: account.accountName,
        });
      }
    });
  }

  getAccountLabel(account: any): string {
    const detail = this.accountOptions?.find((acc) => acc.value === account);
    return account ? detail?.label! : '';
  }
}
