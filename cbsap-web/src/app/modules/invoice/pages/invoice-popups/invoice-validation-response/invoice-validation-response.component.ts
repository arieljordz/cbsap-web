import { InvStatusChangeDto } from './../../../../../core/model/invoicing/invoice/invoice-info.dto';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  InvoiceActionButton,
  InvoiceQueue,
  InvoiceStatusEnum,
} from '@core/enums';
import { ResponseResult } from '@core/model/common';
import { InvoiceDto } from '@core/model/invoicing/invoicing.index';
import { AlertService, InvoiceDetailService } from '@core/services';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { ConfirmationService } from 'primeng/api';
import {
  DynamicDialogRef,
  DynamicDialogConfig,
  DialogService,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-invoice-validation-response',
  standalone: true,
  providers: [DialogService, AlertService, ConfirmationService],
  imports: [PrimeImportsModule, NgFor, NgClass, NgIf],
  templateUrl: './invoice-validation-response.component.html',
  styleUrl: './invoice-validation-response.component.scss',
})
export class InvoiceValidationResponseComponent implements OnInit {
  messages: string[] = [];
  action!: InvoiceActionButton;
  promptMsg: string = '';
  invoiceID!: number;

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private invDetail: InvoiceDetailService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    this.messages = (this.config.data?.messages as string[]) ?? [];
    this.action = (this.config.data?.action as InvoiceActionButton) ?? null;
    this.invoiceID = (this.config.data?.invoiceID as number) ?? 0;

    this.promptMsg = this.validationInfo(this.action);
  }

  force() {
    if (this.getHasMissingRoutingFlow()) {
      return;
    }

    const invoiceStatusChangeDTO: InvStatusChangeDto = {
      invoiceID: this.invoiceID,
      status: InvoiceStatusEnum.ForApproval,
      reason: '"Invoice is Force to Submit from Exception Queue',
    };

    this.invDetail.forceToSubmit(invoiceStatusChangeDTO).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dialogRef.close(true);
        }
      },
      error: (error: ResponseResult<boolean>) => {},
    });
  }

  continue() {
    this.dialogRef.close(true);
  }

  validationInfo(action: InvoiceActionButton): string {
    
    switch (action.toLowerCase()) {
      case InvoiceActionButton.Submit:
        if(this.getHasMissingRoutingFlow()){
          return 'Invoice is missing a role/Routing Flow and cannot be forced/submitted.';
        }

        return 'The invoice contains errors and is not able to be approved. Do you want to route the invoice to the next role in the flow?';


      case InvoiceActionButton.Approve:

        return ' The invoice contains errors and is not able to be approved.';

      default:
        return '';
    }
  }

  forceButtonVisible(): boolean {
    return (
      this.action.toLowerCase() === InvoiceActionButton.Submit &&
      !this.getHasMissingRoutingFlow()

    );
  }

  getHasMissingRoutingFlow(): boolean {
    return this.messages?.some(msg =>

    msg.includes('Invoice has a missing routing flow')
    ) ?? false;
  }
}
