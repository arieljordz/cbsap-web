import {
  InvoiceStatusEnum,
  InvoiceQueue,
  InvoiceActionButton,
} from '@core/enums';

export interface QueueConfig {
  status?: InvoiceStatusEnum;
  buttonLabel: string;
  color?: Severity;
}

export const QueueActionConfigMap: Partial<
  Record<InvoiceQueue, Partial<Record<InvoiceActionButton, QueueConfig>>>
> = {
  [InvoiceQueue.MyInvoices]: {
    [InvoiceActionButton.Hold]: {
      status: InvoiceStatusEnum.ApprovalOnHold,
      buttonLabel: 'Put on Approval Hold',
      color: 'warn',
    },
    [InvoiceActionButton.RouteToException]: {
      status: InvoiceStatusEnum.Exception,
      buttonLabel: 'Route to Exception',
      color: 'warn',
    },
  },
  [InvoiceQueue.ExceptionQueue]: {
    [InvoiceActionButton.Hold]: {
      status: InvoiceStatusEnum.ExceptionOnHold,
      buttonLabel: 'Put on Hold',
      color: 'warn',
    },
    [InvoiceActionButton.Reject]: {
      status: InvoiceStatusEnum.Rejected,
      buttonLabel: 'Reject Invoice',
      color: 'danger',
    },
  },
  [InvoiceQueue.RejectionQueue]: {
    [InvoiceActionButton.Reactivate]: {
      status: InvoiceStatusEnum.Exception,
      buttonLabel: 'Reactivate Invoice',
      color: 'success',
    },
  },
};

export type Severity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'help'
  | 'danger'
  | 'contrast';
