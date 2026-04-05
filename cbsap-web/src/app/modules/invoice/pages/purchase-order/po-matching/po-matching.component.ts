
import {
  CommonModule,
  NgFor,
  NgIf
} from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatusDescriptions } from '@core/constants/purchase-order/po-matching.constants';
import { POMatchingStatus } from '@core/enums/po-matching.enum';
import { ResponseResult, TableColumn } from '@core/model/common';
import {
  SearchPoLinesDto,
  SearchPOResult,
} from '@core/model/purchase-order/po-lines.dto';
import { AlertService, GridService, InvoiceFormService } from '@core/services';
import { PurchaseOrderService } from '@core/services/purchase-order/purchase-order.service';
import { trackByValue } from '@core/utils/shared-utils';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Table, TableCheckbox } from 'primeng/table';
import { filter, of, Subject, Subscription, takeUntil } from 'rxjs';
import { InvoiceImageViewerComponent } from '../../invoice-pages.index';
import { SearchPurchaseOrderComponent } from '../search-purchase-order/search-purchase-order.component';
import {
  PoLinesDto,
  SavePOMatchingDto,
} from './../../../../../core/model/purchase-order/po-lines.dto';
import { ThemeProvider } from 'primeng/config';
import { PoLinesSharedService } from '@core/services/purchase-order/po-lines-shared.service';
import {
  compileDeclareDirectiveFromMetadata,
  ElementSchemaRegistry,
} from '@angular/compiler';
import { MessageSeverity } from '@core/constants';

@Component({
  selector: 'app-po-matching',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PrimeImportsModule,
    InvoiceImageViewerComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './po-matching.component.html',
  styleUrl: './po-matching.component.scss',
})
export class PoMatchingComponent
  implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit
{
  private destroy$ = new Subject<void>();
  trackByValue = trackByValue;
  availablePOcolumns: TableColumn[] = [];

  matchingLinesColumns: TableColumn[] = [];
  sizes: any;

  //source
  availablesPOs: PoLinesDto[] = [];
  //checkedbox
  srcSelectedPOline: PoLinesDto[] = [];

  //target
  matchingPOs: PoLinesDto[] = [];

  targetMatchPoLines: PoLinesDto[] = [];

  originalQtyMap: Record<string, number> = {};

  @ViewChildren('chkBoxAvailablePO', { read: TableCheckbox })
  availablePOsCheckbox!: QueryList<TableCheckbox>;
  private checkboxChangesSub?: Subscription;

  hasVisibleCheckbox = false;
  invoiceID: number = 0;
  invNo: string = '';
  invPONo: string = '';
  public StatusDescriptions = StatusDescriptions;

  hasPOMatching: boolean = false;
  @ViewChild('tablePO') tablePO: Table | undefined;

  @ViewChild('tableMatchingPO') tableMatchingPO: Table | undefined;

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private gridService: GridService,
    private purchaseOrderService: PurchaseOrderService,
    private invFormService: InvoiceFormService,
    private poLinesSharedService: PoLinesSharedService,
    private message: AlertService,
  ) {
    this.invNo = (this.config.data?.invoiceNo as string) ?? '';
    this.invoiceID = (this.config.data?.invoiceID as number) ?? 0;
  }

  ngAfterViewInit(): void {
    this.checkboxChangesSub = this.availablePOsCheckbox.changes.subscribe(
      () => {
        this.updateVisibleCheckboxStatus();
      }
    );
  }
  ngAfterViewChecked(): void {
    this.updateVisibleCheckboxStatus();
  }
  ngOnDestroy(): void {
    this.checkboxChangesSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.availablePOcolumns = this.gridService.searchPOlinesColumn();
    this.matchingLinesColumns = this.gridService.POMatchingLineColumn();
    this.poLinesSharedService
      .getSharedInvDataToSearchPO()
      .pipe(takeUntil(this.destroy$))
      .subscribe((values) => {
        this.invPONo = values?.poNo!;
      });

    this.loadPOMatching();
  }

  /** */

  updateVisibleCheckboxStatus(): void {
    if (this.availablesPOs.length)
      this.hasVisibleCheckbox = this.availablePOsCheckbox.length > 0;
  }

  savePO() {
    const savePOMatching: SavePOMatchingDto = {
      invoiceID: this.invoiceID,
      poLines: this.matchingPOs,
    };

    if (!this.hasPOMatching) {
      this.purchaseOrderService.savePOMatching(savePOMatching).subscribe({
        next: (response) => {
          // if (response.isSuccess) {
          //   this.invFormService.triggerClosePODialog();
          //   this.dialogRef.close();
          // }

          this.message.showToast(
            MessageSeverity.success.toString(),
            'Purchase Order Matching',
            'Purchase Order saved successfully.',
            2000
          );

        },
        error: (error: ResponseResult<boolean>) => {},
        complete: () => {},
      });
    } else {
      this.purchaseOrderService.updatePOMatching(savePOMatching).subscribe({
        next: (response) => {
          // if (response.isSuccess) {
          //   this.invFormService.triggerClosePODialog();
          //   this.dialogRef.close();
          // }

          this.message.showToast(
            MessageSeverity.success.toString(),
            'Purchase Order Matching',
            'Purchase Order saved successfully.',
            2000
          );
        },
        error: (error: ResponseResult<boolean>) => {},
        complete: () => {},
      });
    }
  }
  cancel() {
    this.dialogRef.close();
  }
  SearchPO() {
    const ref = this.dialogService.open(SearchPurchaseOrderComponent, {
      header: 'Search PO ',
      modal: true,
      closable: true,
      draggable:true,
      width: '100rem',

      data: {
        excludesMatchPOLineIds: this.matchingPOs.map(
          (po) => po.purchaseOrderLineID
        ),
      },
      style: { minHeight: '200px' },
      dismissableMask: true,
      baseZIndex: 1200,
    });

    // ref.onClose.subscribe((polines: PoLinesDto[] | null | undefined) => {
    ref.onClose.subscribe((result: SearchPOResult) => {
      const polines = result.polines! as PoLinesDto[] | null;

      if (result.polines === undefined) {
        return;
      }
      if (!polines || polines.length === 0) {
        this.availablesPOs = [];
        return;
      }

      if (this.availablesPOs.length > 0) {
        const mergedRecords = [...this.availablesPOs];
        //console.log('first loaad', mergedRecords);

        polines?.forEach((newRecord) => {
          const index = mergedRecords.findIndex(
            (i) => i.lineNo === newRecord?.lineNo
          );
          if (index !== -1) {
            // mergedRecords[index] = newRecord;

            mergedRecords[index] = {
              ...mergedRecords[index],
              ...newRecord,
              invoiceID: mergedRecords[index].invoiceID,
              mergeQty: mergedRecords[index].qty,
              purchaseOrderMatchTrackingID:
                mergedRecords[index].purchaseOrderMatchTrackingID,
            };
          } else {
            mergedRecords.push(newRecord!);
          }
        });

        this.availablesPOs = mergedRecords;
      } else {
        this.availablesPOs = polines;
      }

      const filterRecords = this.availablesPOs.map((src) => {
        //target table
        const target = this.matchingPOs.find(
          (line) =>
            line.lineNo === src.lineNo &&
            line.purchaseOrderLineID === src.purchaseOrderLineID
        );

        let matchableQty = 0;

        // have save in database
        if (target !== undefined) {
          //matchable qty in src vs qty in target in new entry
          if (src.qty === 0 && src.remainingQty === 0) {
            matchableQty = 0;
          } else if (src.qty !== target?.qty && src.baseRemainingQty == 0) {
            matchableQty = Math.abs(target?.qty! - src.remainingQty);

            if (target?.purchaseOrderMatchTrackingID !== 0) {
              matchableQty = Math.abs(target?.qty! - src.totalMatchedQty);
            }
          } else if (
            src.qty !== target?.qty &&
            src.totalMatchedQty != 0 &&
            src.baseRemainingQty != 0
          ) {
            // matchableQty = Math.abs(
            //   src.originalQty - (src.baseRemainingQty + target?.qty!)
            // matchableQty = Math.abs(src.baseRemainingQty - target?.qty!);
            matchableQty = Math.abs(src.remainingQty - target?.qty!);

            if (target?.purchaseOrderMatchTrackingID != 0) {
              matchableQty = src.remainingQty;
            }
          } else if (src.qty !== target?.qty && src.totalMatchedQty == 0) {
            matchableQty = Math.abs(src.originalQty - target?.qty!);
          } else if (src.qty === target?.qty && src.totalMatchedQty != 0) {
            matchableQty = Math.abs(src.originalQty - (src.qty + target?.qty!));
          } else if (
            src.storedRemainingQty === undefined ||
            src.storedRemainingQty === 0
          ) {
            matchableQty = Math.abs(
              target.qty + src.totalMatchedQty - src.originalQty
            );
          }
        } else {
          //no record in matching po

          const linNumber = src.lineNo;
          if (src.purchaseOrderMatchTrackingID !== 0) {
            matchableQty = Math.abs(src.mergeQty - src.qty) + src.qty;
          } else if (
            src.purchaseOrderMatchTrackingID === 0 &&
            (src.storedRemainingQty === 0 ||
              src.storedRemainingQty === undefined)
          ) {
            const consumableQty = src.originalQty - src.totalMatchedQty;
            matchableQty = consumableQty;
            // if (src.totalMatchedQty === 0) {
            //   matchableQty = src.qty;
            // } else if (src.totalMatchedQty !== 0) {
            //   matchableQty = src.qty + src.totalMatchedQty;
            // } else {
            //   // matchableQty = consumableQty + src.qty;

            //   matchableQty = consumableQty;
            // }
          } else if (
            src.storedRemainingQty === undefined ||
            src.storedRemainingQty === 0
          ) {
            matchableQty = Math.abs(
              src.totalMatchedQty + src.baseRemainingQty - src.baseRemainingQty
            );

            if (src.totalMatchedQty == 0) {
              matchableQty = src.qty;
            }
          } else if (src.storedRemainingQty !== 0) {
            matchableQty = src.storedRemainingQty + src.qty;
          } else {
            matchableQty = src.qty;
          }
        }

        const baseRemainingQty = src.baseRemainingQty;
        const price = Number(src.price) || 0;
        const amount = matchableQty * price;

        return {
          ...src,
          remainingQty: matchableQty,
          qty: matchableQty,
          amount: amount,
        };
      });

      this.availablesPOs = result.isAvailableOrder
        ? filterRecords.filter(
            (line) => line.qty !== 0 && line.remainingQty !== 0
          )
        : filterRecords;

      this.invFormService.triggerClosePODialog();
    });
  }

  /** actions */

  matchAll() {
    this.availablesPOs.forEach((line) => {
      const matchQty = Number(line.qty) || 0; // matchableQty
      const initTotalMatchedDB = Number(line.totalMatchedQty) || 0;
      const totalMatchedUI = Number(line.totalMatchedQtyUI) || 0;
      const original = Number(line.originalQty) || 0;

      let remaining = Math.max(original - initTotalMatchedDB, 0);

      if (remaining <= 0 && matchQty > 0) {
        remaining = matchQty;
      }

      const safeMatchQty = matchQty;

      const existingMatch = this.matchingPOs.find(
        (m) => m.purchaseOrderLineID === line.purchaseOrderLineID
      );

      if (existingMatch) {
        existingMatch.qty += safeMatchQty;
        const price = Number(existingMatch.price) || 0;

        existingMatch.amount = existingMatch.qty * price;

        existingMatch.totalMatchedQty =
          (Number(line.totalMatchedQty) || 0) + safeMatchQty;

        existingMatch.remainingQty = Math.max(
          Number(line.originalQty) - existingMatch.totalMatchedQty,
          0
        );

        if (line.qty != 0 && line.remainingQty != 0) {
          existingMatch.status = this.updateMatchingStatus(
            existingMatch.totalMatchedQty,
            safeMatchQty,
            line
          );
        }
      } else {
        const storedRemaining = line.storedRemainingQty;
        line.totalMatchedQtyUI = totalMatchedUI + safeMatchQty;

        if (storedRemaining !== 0 && storedRemaining !== undefined) {
          line.totalMatchedQtyUI = line.storedRemainingQty + safeMatchQty;
        }

        //check db
        if (line.totalMatchedQty != 0) {
          let currentRemainingQty = 0;

          if (line.poNo === this.invPONo) {
            if (initTotalMatchedDB === 0) {
              currentRemainingQty = Math.abs(
                original - (line.remainingQty + line.totalMatchedQtyUI)
              );
            }
          } else {
            line.remainingQty = line.remainingQty;
          }

          line.remainingQty =
            currentRemainingQty === 0
              ? line.totalMatchedQtyUI
              : currentRemainingQty;
        } else {
          line.remainingQty = Math.max(original - line.totalMatchedQtyUI, 0);
        }
        line.status = this.updateMatchingStatus(
          line.totalMatchedQtyUI,
          safeMatchQty,
          line
        );

        this.matchingPOs.push({
          purchaseOrderLineID: line.purchaseOrderLineID,
          purchaseOrderID: line.purchaseOrderID,
          purchaseOrderMatchTrackingID: line.purchaseOrderMatchTrackingID,
          invoiceID: this.invoiceID,
          invAllocLineID: line.invAllocLineID,
          poNo: line.poNo,
          lineNo: line.lineNo,
          description: line.description,
          accountID: line.accountID,
          accountName: line.accountName,
          qty: safeMatchQty,
          price: line.price,
          netAmount: line.netAmount,
          taxAmount: line.taxAmount,
          amount: line.amount,
          status: line.status,
          remainingQty: line.remainingQty,
          originalQty: line.originalQty,
          totalMatchedQty: line.totalMatchedQty,
          basedQty: line.basedQty,
          isForEditPOMatching: line.isForEditPOMatching,
          storedRemainingQty: line.storedRemainingQty,
          totalMatchedQtyUI: line.totalMatchedQtyUI,
          baseRemainingQty: line.baseRemainingQty,
          mergeQty: safeMatchQty,
        });

        line.remainingQty = 0;
        line.totalMatchedQtyUI = 0;
        line.storedRemainingQty = 0;
      }
    });

    // filter
    this.availablesPOs = [];
    this.srcSelectedPOline = [];
    this.tableMatchingPO?.reset();
  }

  unmatchAll() {
    if (this.matchingPOs.length === 0) return;
    const previouslyMatched = [...this.matchingPOs];
    this.matchingPOs = [];
    this.srcSelectedPOline = [];

    previouslyMatched.forEach((matched) => {
      const qtyToUnmatched = matched.qty;
      const status = matched.status;
      let matchedPurchaseOrderMatchTrackingID =
        Number(matched.purchaseOrderMatchTrackingID) || 0;

      const index = this.availablesPOs.findIndex(
        (l) => l.purchaseOrderLineID === matched.purchaseOrderLineID
      );
      let newRemainingQty = 0;
      if (index > -1) {
        newRemainingQty = this.availablesPOs[index].qty + qtyToUnmatched;
        let matchableQty = newRemainingQty;
        const updated = {
          ...this.availablesPOs[index],
          remainingQty: newRemainingQty,
          qty: qtyToUnmatched,
          purchaseOrderMatchTrackingID: matchedPurchaseOrderMatchTrackingID,
        };

        this.availablesPOs[index] = updated;
      } else {
        newRemainingQty = matched.qty;
        // matchedPurchaseOrderMatchTrackingID = 0;
        this.availablesPOs.push({
          ...matched,
          status: status,
          remainingQty: newRemainingQty,
          qty: newRemainingQty,
          purchaseOrderMatchTrackingID: matchedPurchaseOrderMatchTrackingID,
        });
      }
    });

    this.availablesPOs.forEach((line) => {
      this.purchaseOrderService
        .getPOLineUsage(line.purchaseOrderLineID)
        .subscribe({
          next: (res: ResponseResult<number>) => {
            const totalMatchedQtyDB = res.responseData ?? 0;
            const baseRemainingDBValue = Number(line.baseRemainingQty) || 0;
            const currRemainingDBValue = Number(line.remainingQty) || 0;
            const originalQty = Number(line.originalQty) || 0;

            let netConsumed = originalQty - totalMatchedQtyDB;
            const matchableQty = Number(line.qty) || 0;
            const localstoredRemainingQty =
              Number(line.storedRemainingQty) || 0;

            const price = Number(line.price) || 0;
            let computedQty = matchableQty;

            line.totalMatchedQty = totalMatchedQtyDB;

            if (
              totalMatchedQtyDB === originalQty &&
              baseRemainingDBValue == 0
            ) {
              // find
              line.baseRemainingQty = line.baseRemainingQty;
              line.remainingQty = matchableQty;
              line.amount = matchableQty * price;
              return;
            }

            if (line.purchaseOrderMatchTrackingID === 0) {
              line.remainingQty = line.baseRemainingQty;
              line.qty = line.baseRemainingQty;
              //--added code
            } else if (
              totalMatchedQtyDB == 0 &&
              baseRemainingDBValue == originalQty
            ) {
              computedQty = originalQty;
              line.remainingQty = computedQty;
              line.qty = computedQty;
              //--added code
              line.baseRemainingQty = computedQty;
            }
            //with existing records
            else if (
              baseRemainingDBValue != 0 &&
              baseRemainingDBValue !== originalQty
            ) {
              if (
                baseRemainingDBValue === matchableQty &&
                localstoredRemainingQty === 0 &&
                totalMatchedQtyDB === 0
              ) {
                computedQty = baseRemainingDBValue + matchableQty;
              } else if (
                baseRemainingDBValue !== matchableQty &&
                localstoredRemainingQty !== 0
              ) {
                computedQty = line.qty + localstoredRemainingQty;
              } else if (baseRemainingDBValue !== matchableQty) {
                computedQty = netConsumed + line.qty;
              } else if (baseRemainingDBValue === matchableQty) {
                computedQty = line.basedQty + matchableQty;
              } else {
                computedQty = baseRemainingDBValue + line.qty;
              }

              line.remainingQty = computedQty;
              line.qty = computedQty;
            } else if (
              baseRemainingDBValue != 0 &&
              baseRemainingDBValue !== originalQty &&
              localstoredRemainingQty !== 0
            ) {
              computedQty = localstoredRemainingQty + line.qty;
              line.remainingQty = computedQty;
              line.qty = computedQty;
            }

            line.amount = computedQty * price;
            line.storedRemainingQty = 0;
            line.totalMatchedQtyUI = 0;

            if (line.originalQty === totalMatchedQtyDB) {
              line.baseRemainingQty = line.remainingQty;
            }
          },
          error: (err) => console.error('Fetch PO usage failed', err),
        });
    });

    this.availablesPOs = [...this.availablesPOs];
  }

  unmatchSelected() {
    if (this.matchingPOs.length === 0) return;
    const selected = Array.isArray(this.targetMatchPoLines)
      ? this.targetMatchPoLines
      : [];

    if (selected.length === 0) return;

    const qtyByPOLine: Record<string, number> = {};
    for (const m of selected) {
      const key = String(m.purchaseOrderLineID);
      const qty = Number(m.qty) || 0;
      qtyByPOLine[key] = (qtyByPOLine[key] || 0) + qty;
    }

    const selectedSet = new Set(selected.map((m: any) => m));
    this.matchingPOs = (this.matchingPOs || []).filter(
      (m: any) => !selectedSet.has(m)
    );

    Object.entries(qtyByPOLine).forEach(([key, qtyToUnmatched]) => {
      const idx = (this.availablesPOs || []).findIndex(
        (l: any) => String(l.purchaseOrderLineID) === key
      );

      if (idx > -1) {
        const srcLine = this.availablesPOs[idx];
        const newRemainingQty =
          (Number(srcLine.remainingQty) || 0) + (Number(qtyToUnmatched) || 0);

        const updated = {
          ...srcLine,
          remainingQty: newRemainingQty,
          qty: qtyToUnmatched, // make the newly unmatched qty actionable
          status: srcLine.status ?? null,
        };

        this.availablesPOs[idx] = updated;
      } else {
        const matchedProto = selected.find(
          (m: any) => String(m.purchaseOrderLineID) === key
        );

        this.availablesPOs.push({
          ...matchedProto!,
          status: null,
          qty: qtyToUnmatched,
          remainingQty: qtyToUnmatched,
        });
      }
    });

    // 🔄 Refresh array for change detection
    this.availablesPOs = [...this.availablesPOs];

    // 4) Sync with backend for affected lines to recalc totals
    Object.keys(qtyByPOLine).forEach((key) => {
      const purchaseOrderLineID = Number(key);
      this.purchaseOrderService.getPOLineUsage(purchaseOrderLineID).subscribe({
        next: (res: ResponseResult<number>) => {
          const idx = this.availablesPOs.findIndex(
            (l: any) => Number(l.purchaseOrderLineID) === purchaseOrderLineID
          );
          if (idx === -1) return;

          const line = this.availablesPOs[idx];
          const totalMatchedQtyDB = res.responseData ?? 0;
          const baseRemainingDBValue = Number(line.baseRemainingQty) || 0;
          const currRemainingDBValue = Number(line.remainingQty) || 0;
          const originalQty = Number(line.originalQty) || 0;

          let netConsumed = originalQty - totalMatchedQtyDB;
          const matchableQty = Number(line.qty) || 0;
          const localstoredRemainingQty = Number(line.storedRemainingQty) || 0;

          const price = Number(line.price) || 0;
          let computedQty = matchableQty;

          line.totalMatchedQty = totalMatchedQtyDB;

          if (totalMatchedQtyDB === originalQty && baseRemainingDBValue == 0) {
            // find
            line.baseRemainingQty = line.baseRemainingQty;
            line.remainingQty = matchableQty;
            line.amount = matchableQty * price;
            return;
          }

          if (line.purchaseOrderMatchTrackingID === 0) {
            line.remainingQty = line.baseRemainingQty;
            line.qty = line.baseRemainingQty;
            //--added code
          } else if (
            totalMatchedQtyDB == 0 &&
            baseRemainingDBValue == originalQty
          ) {
            computedQty = originalQty;
            line.remainingQty = computedQty;
            line.qty = computedQty;
            //--added code
            line.baseRemainingQty = computedQty;
          }
          //with existing records
          else if (
            baseRemainingDBValue != 0 &&
            baseRemainingDBValue !== originalQty
          ) {
            if (
              baseRemainingDBValue === matchableQty &&
              localstoredRemainingQty === 0 &&
              totalMatchedQtyDB === 0
            ) {
              computedQty = baseRemainingDBValue + matchableQty;
            } else if (
              baseRemainingDBValue !== matchableQty &&
              localstoredRemainingQty !== 0
            ) {
              computedQty = line.qty + localstoredRemainingQty;
            } else if (baseRemainingDBValue !== matchableQty) {
              computedQty = netConsumed + line.qty;
            } else if (baseRemainingDBValue === matchableQty) {
              computedQty = line.basedQty + matchableQty;
            } else {
              computedQty = baseRemainingDBValue + line.qty;
            }

            line.remainingQty = computedQty;
            line.qty = computedQty;
          } else if (
            baseRemainingDBValue != 0 &&
            baseRemainingDBValue !== originalQty &&
            localstoredRemainingQty !== 0
          ) {
            computedQty = localstoredRemainingQty + line.qty;
            line.remainingQty = computedQty;
            line.qty = computedQty;
          }

          line.amount = computedQty * price;
          line.storedRemainingQty = 0;
          line.totalMatchedQtyUI = 0;

          if (line.originalQty === totalMatchedQtyDB) {
            line.baseRemainingQty = line.remainingQty;
          }
        },
        error: (err) => console.error('Fetch PO usage failed', err),
      });
    });

    this.targetMatchPoLines = [];
  }

  matchSelected() {
    const selected = Array.isArray(this.srcSelectedPOline)
      ? this.srcSelectedPOline
      : [];

    if (selected.length === 0) return;

    selected.forEach((line: any) => {
      const matchQty = Number(line.qty) || 0; // matchableQty
      const initTotalMatchedDB = Number(line.totalMatchedQty) || 0;
      const totalMatchedUI = Number(line.totalMatchedQtyUI) || 0;
      const original = Number(line.originalQty) || 0;
      const price = Number(line.price) || 0;

      let remaining = Math.max(original - initTotalMatchedDB, 0);

      if (remaining <= 0 && matchQty > 0) {
        remaining = matchQty;
      }

      const safeMatchQty = matchQty;

      const existingMatch = this.matchingPOs.find(
        (m: any) => m.purchaseOrderLineID === line.purchaseOrderLineID
      );

      if (existingMatch) {
        existingMatch.qty += safeMatchQty;

        existingMatch.totalMatchedQty =
          (Number(line.totalMatchedQty) || 0) + safeMatchQty;

        existingMatch.remainingQty = Math.max(
          Number(line.originalQty) - existingMatch.totalMatchedQty,
          0
        );

        existingMatch.amount = safeMatchQty * existingMatch.price!;

        if (line.qty != 0 && line.remainingQty != 0) {
          existingMatch.status = this.updateMatchingStatus(
            existingMatch.totalMatchedQty,
            safeMatchQty,
            line
          );
        }
      } else {
        const storedRemaining = line.storedRemainingQty;

        // Update UI-tracked matched totals
        line.totalMatchedQtyUI = totalMatchedUI + safeMatchQty;

        if (storedRemaining !== 0 && storedRemaining !== undefined) {
          line.totalMatchedQtyUI = storedRemaining + safeMatchQty;
        }

        // Recompute remaining based on DB & invoice PO no.
        if (line.totalMatchedQty != 0) {
          let currentRemainingQty = 0;

          if (line.poNo === this.invPONo) {
            if (initTotalMatchedDB === 0) {
              currentRemainingQty = Math.abs(
                original -
                  (Number(line.remainingQty) + Number(line.totalMatchedQtyUI))
              );
            }
          } else {
            // retain existing remaining for other POs
            line.remainingQty = line.remainingQty;
          }

          line.remainingQty =
            currentRemainingQty === 0
              ? Number(line.totalMatchedQtyUI)
              : currentRemainingQty;
        } else {
          line.remainingQty = Math.max(
            original - Number(line.totalMatchedQtyUI),
            0
          );
        }

        // Update status
        line.status = this.updateMatchingStatus(
          Number(line.totalMatchedQtyUI),
          safeMatchQty,
          line
        );

        // Push to matchingPOs
        this.matchingPOs.push({
          purchaseOrderLineID: line.purchaseOrderLineID,
          purchaseOrderID: line.purchaseOrderID,
          purchaseOrderMatchTrackingID: line.purchaseOrderMatchTrackingID,
          invoiceID: this.invoiceID,
          invAllocLineID: line.invAllocLineID,
          poNo: line.poNo,
          lineNo: line.lineNo,
          description: line.description,
          accountID: line.accountID,
          accountName: line.accountName,
          qty: safeMatchQty,
          price: line.price,
          netAmount: line.netAmount,
          taxAmount: line.taxAmount,
          amount: line.amount,
          status: line.status,
          remainingQty: line.remainingQty,
          originalQty: line.originalQty,
          totalMatchedQty: line.totalMatchedQty,
          basedQty: line.basedQty,
          isForEditPOMatching: line.isForEditPOMatching,
          storedRemainingQty: line.storedRemainingQty,
          totalMatchedQtyUI: line.totalMatchedQtyUI,
          baseRemainingQty: line.baseRemainingQty,
          mergeQty: safeMatchQty,
        });
      }
    });

    const selectedIds = new Set(
      selected.map((l: any) => String(l.purchaseOrderLineID))
    );
    this.availablesPOs = (this.availablesPOs || []).filter(
      (l: any) => !selectedIds.has(String(l.purchaseOrderLineID))
    );

    this.srcSelectedPOline = [];
    this.tableMatchingPO?.reset();
  }

  onRowSelected(event: any) {
    const selected = event.data;
  }
  isDataFieldZero(): boolean {
    return this.availablesPOs.every((line) => line.qty === 0);
  }
  isInTarget(item: PoLinesDto): boolean {
    let inTarget: boolean = false;

    if (item.qty === 0) return (inTarget = false);
    if (
      item.isForEditPOMatching === true &&
      item.remainingQty === 0 &&
      item.qty !== 0
    ) {
      return (inTarget = true);
    }
    return (inTarget = item.remainingQty !== 0);
  }

  enableEdit(row: PoLinesDto) {
    row.isForEditPOMatching = true;
  }

  onQtyChange(rowData: PoLinesDto) {
    const originalQty = Number(rowData.originalQty) || 0;
    const baseRemainingQty = Number(rowData.baseRemainingQty) || 0;
    const currentComputedRemaiing = Number(rowData.remainingQty) || 0;
    const qtyInputted = Number(rowData.qty) || 0;
    const price = Number(rowData.price) || 0;
    const initTotalMatchedDB = Number(rowData.totalMatchedQty) || 0;

    const computedTotalQty = baseRemainingQty + initTotalMatchedDB;
    let newRemainingQty = 0;
    let totalMatchedQtyUI = 0;
    if (originalQty === initTotalMatchedDB && baseRemainingQty == 0) {
      // newRemainingQty =  baseRemainingQty +
    }

    if (initTotalMatchedDB == 0) {
      newRemainingQty = Math.max(computedTotalQty - qtyInputted, 0);
    } else if (
      initTotalMatchedDB !== 0 &&
      currentComputedRemaiing > initTotalMatchedDB
    ) {
      newRemainingQty = Math.max(currentComputedRemaiing - qtyInputted, 0);
    } else if (
      initTotalMatchedDB !== 0 &&
      currentComputedRemaiing <= initTotalMatchedDB
    ) {
      newRemainingQty = Math.max(currentComputedRemaiing - qtyInputted, 0);
    }

    rowData.remainingQty = newRemainingQty;
    rowData.storedRemainingQty = newRemainingQty;

    rowData.totalMatchedQtyUI = totalMatchedQtyUI;

    rowData.amount = qtyInputted * price;

    rowData.isForEditPOMatching = true;
    this.isInTarget(rowData);
  }

  private updateMatchingStatus(
    totalMatchedQty: number,
    qtyInputted: number,
    rowData: PoLinesDto
  ): POMatchingStatus {
    const totalMatchedQtyUI = rowData.totalMatchedQtyUI;
    const totalMatchedDB = rowData.totalMatchedQty;
    const originalQty = rowData.originalQty;
    const remainingQty = rowData.remainingQty;

    if (totalMatchedDB == 0 && qtyInputted !== originalQty) {
      const totalRemainingCurrent = originalQty - totalMatchedQtyUI;
      if (totalRemainingCurrent <= originalQty) {
        return POMatchingStatus.PartialMatched;
      }
    }

    if (totalMatchedDB !== 0 && originalQty !== remainingQty) {
      if (qtyInputted < remainingQty && qtyInputted > 0) {
        return POMatchingStatus.PartialMatched;
      }
      if (qtyInputted == remainingQty) {
        return POMatchingStatus.FullyMatched;
      }
    }
    //have db update
    if (totalMatchedDB != 0) {
      const condition = Math.abs(totalMatchedDB - remainingQty);
      const forQuantitfy = condition === 0 ? originalQty : remainingQty;

      if (qtyInputted === forQuantitfy) return POMatchingStatus.FullyMatched;

      const totalRemainingCurrent = Math.abs(remainingQty - qtyInputted);
      if (totalRemainingCurrent <= remainingQty) {
        return POMatchingStatus.PartialMatched;
      }
      return POMatchingStatus.FullyMatched;
    }

    if (totalMatchedQtyUI === 0 && qtyInputted === 0) {
      return POMatchingStatus.Unmatched;
    }

    if (totalMatchedQty >= rowData.originalQty) {
      return POMatchingStatus.FullyMatched;
    }
    return POMatchingStatus.PartialMatched;
  }

  onEditInit(event: PoLinesDto, field: string) {
    const line = event as PoLinesDto;
    if (line.purchaseOrderLineID != null && line.qty != null) {
      this.originalQtyMap[line.purchaseOrderLineID] = line.qty;
    }
  }

  onEmptyOrNullInput(event: Event, matching: PoLinesDto) {
    const input = event.target as HTMLInputElement | null;
    const value = input?.value ?? '';

    const trimmed = value.trim();
    if (!trimmed || +trimmed === 0) {
      matching.qty = this.originalQtyMap[matching.purchaseOrderLineID];
      this.getPOMatchingStatus(
        matching.qty,
        this.originalQtyMap[matching.purchaseOrderLineID],
        matching
      );
      return;
    }
  }

  private getPOMatchingStatus(
    qty: number,
    originalQty: number,
    matching: PoLinesDto
  ) {
    const matchQty = Number(qty || 0);

    if (matchQty === 0 || matchQty > originalQty) {
      matching.status = POMatchingStatus.Unmatched;
    } else if (matchQty === originalQty) {
      matching.status = POMatchingStatus.FullyMatched;
    } else if (qty < originalQty) {
      matching.status = POMatchingStatus.PartialMatched;
    } else {
      matching.status = POMatchingStatus.Unmatched;
    }
  }

  getStatusSeverity(status: POMatchingStatus) {
    switch (status) {
      case POMatchingStatus.FullyMatched:
        return 'success';
      case POMatchingStatus.PartialMatched:
        return 'warn';
      case POMatchingStatus.Unmatched:
        return 'danger';
      default:
        return 'contrast';
    }
  }

  getMaxValue(rowData: any, field: string): number {
    return field === 'qty' ? rowData.baseRemainingQty ?? 0 : 0;
  }

  handleZeroInput(rowData: any, field: string) {
    if (rowData[field] === 0) {
      rowData[field] = this.getMaxValue(rowData, field);
    }
  }

  loadPOMatching() {
    this.purchaseOrderService
      .getInvoiceByInvID(this.invPONo, this.invoiceID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            const polines = res.responseData!.flatMap((items) => items.poLines);

            const cleanedArray: PoLinesDto[] = polines.filter(
              (item): item is PoLinesDto => item !== null
            );

            this.hasPOMatching = true;
            this.matchingPOs = cleanedArray!;
          }
        },
        error: (error: ResponseResult<SearchPoLinesDto>) => {
          //this.dialogRef.close(error.responseData);
        },
      });
  }

  isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }
}
