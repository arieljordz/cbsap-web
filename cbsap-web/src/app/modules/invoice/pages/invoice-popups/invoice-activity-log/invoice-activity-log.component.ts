import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ValidationService,
  InvoiceDetailService,
  AlertService,
} from '@core/services';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { InvActivityLogDto } from '@core/model/invoicing/invoicing.index';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { JsonPipe, NgFor, NgForOf } from '@angular/common';
import { trackByValue } from '@core/utils/shared-utils';

@Component({
  selector: 'app-invoice-activity-log',
  standalone: true,
  imports: [PrimeImportsModule, NgForOf],
  templateUrl: './invoice-activity-log.component.html',
  styleUrl: './invoice-activity-log.component.scss',
})
export class InvoiceActivityLogComponent implements OnInit, OnDestroy {
  private destroySubject: Subject<void> = new Subject();
  invoiceID: number = 0;
  trackByValue = trackByValue;

  invoiceActivityLogs!: InvActivityLogDto[];

  /**
   *
   */
  constructor(
    private invDetail: InvoiceDetailService,
    private config: DynamicDialogConfig
  ) {
    this.invoiceID = (this.config.data?.invoiceID as number) ?? 0;
  }
  ngOnInit(): void {
    this.loadInvoiceActivityLog(this.invoiceID);
  }
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  loadInvoiceActivityLog(invoiceID: number) {
    this.invDetail
      .getInvoiceActivityLogByInvID(invoiceID)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.invoiceActivityLogs = res.responseData!;
          }
        },
        error: () => {},
      });
  }
}
