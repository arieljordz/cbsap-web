import { Component, Input } from '@angular/core';
import {
  InvoiceActionButton,
  InvoiceQueue,
  InvoiceStatusEnum,
} from '@core/enums';
import { Permission, PermissionValues } from '@core/model/auth/permission';
import { InvoiceFormService } from '@core/services/invoicing/invoice-form.service';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-invoice-actions',
  standalone: true,
  imports: [PrimeImportsModule],
  templateUrl: './invoice-actions.component.html',
  styleUrl: './invoice-actions.component.scss',
})
export class InvoiceActionsComponent {
  items: MenuItem[] = [];
  private _permissions: PermissionValues[] = [];

  @Input() set currentQueue(value: InvoiceQueue | null | undefined) {
    this._currentQueue = value ?? null;
    this.buildMenuItems(); // Update items when queue changes
  }

  @Input() set permissions(permissions: PermissionValues[]) {
    this._permissions = permissions;
    this.buildMenuItems();
  }

  get currentQueue(): InvoiceQueue | null {
    return this._currentQueue;
  }

  @Input() set currentStatus(value: InvoiceStatusEnum | null | undefined) {
    this._statusQueue = value ?? null;
    this.buildMenuItems(); // Update items when queue changes
  }

  get currentStatus(): InvoiceStatusEnum | null {
    return this._statusQueue;
  }

  private _currentQueue!: InvoiceQueue | null;
  private _statusQueue!: InvoiceStatusEnum | null;

  constructor(private formService: InvoiceFormService) {}

  buildMenuItems() {
    const menuDefinitions: (MenuItem & {
      visibleIn: (InvoiceQueue | InvoiceStatusEnum)[];
      permission?: PermissionValues;
    })[] = [
      {
        label: 'Save',
        icon: 'pi pi-save',
        command: () => this.onSave(),
        visibleIn: [
          InvoiceQueue.MyInvoices,
          InvoiceQueue.ExceptionQueue,
          InvoiceQueue.RejectionQueue,
        ],
        action: InvoiceActionButton.Save,
      },
      {
        label: 'Validate',
        icon: 'pi pi-shield',
        command: () => this.onValidate(),
        visibleIn: [InvoiceQueue.MyInvoices, InvoiceQueue.ExceptionQueue],
        action: InvoiceActionButton.Validate,
      },
      {
        label: 'Submit',
        icon: 'pi pi-check',
        command: () => this.onSubmit(),
        visibleIn: [InvoiceQueue.MyInvoices, InvoiceQueue.ExceptionQueue],
        action: InvoiceActionButton.Submit,
        permission: Permission.CanSubmitInvoice,
      },     
      {
        label: 'Add Comment',
        icon: 'pi pi-comments',
        command: () => this.onOpenAddComment(),
        visibleIn: [
          InvoiceQueue.MyInvoices,
          InvoiceQueue.ExceptionQueue,
          InvoiceQueue.RejectionQueue,
          InvoiceQueue.ArchiveQueue,
        ],
        action: InvoiceActionButton.AddComment,
      },
      {
        label: 'More ..',
        icon: 'pi pi-bars',
        visibleIn: [
          InvoiceQueue.MyInvoices,
          InvoiceQueue.ExceptionQueue,
          InvoiceQueue.RejectionQueue,
          InvoiceQueue.ArchiveQueue,
          InvoiceQueue.ExportedQueue,
          InvoiceQueue.ReadyForExportQueue,
          InvoiceStatusEnum.ReadyForExport,
        ],
        action: InvoiceActionButton.ActivityLog,
        items: [
          {
            label: 'Add Attachments',
            icon: 'pi pi-paperclip',
            command: () => this.onOpenInvAttachment(),
            visibleIn: [InvoiceQueue.MyInvoices, InvoiceQueue.ExceptionQueue],
            action: InvoiceActionButton.AddAttachments,
          },
          {
            label: 'Invoice Activity Log',
            icon: 'pi pi-bolt',
            command: () => this.onOpenInvoiceActivityLog(),
            visibleIn: [
              InvoiceQueue.MyInvoices,
              InvoiceQueue.ExceptionQueue,
              InvoiceQueue.RejectionQueue,
              InvoiceQueue.ArchiveQueue,
              InvoiceQueue.ExportedQueue,
              InvoiceQueue.ReadyForExportQueue,
              InvoiceStatusEnum.ReadyForExport,
            ],
            action: InvoiceActionButton.ActivityLog,
          },
        ],
      },
      {
        label: 'Purchase Order',
        icon: 'pi pi-table',
        command: () => this.onOpenPurchaseOrder(),
        visibleIn: [
          InvoiceQueue.MyInvoices,
          InvoiceQueue.ExceptionQueue,
          InvoiceQueue.RejectionQueue,
        ],
        action: InvoiceActionButton.PurchaseOrder,
        permission: Permission.CanModifyManualMatching,
      },

      {
        label: 'Cancel',
        icon: 'pi pi-ban',
        command: () => this.onCancel(),
        visibleIn: [
          InvoiceQueue.MyInvoices,
          InvoiceQueue.ExceptionQueue,
          InvoiceQueue.RejectionQueue,
          InvoiceQueue.ArchiveQueue,
          InvoiceQueue.ExportedQueue,
          InvoiceQueue.ReadyForExportQueue,
          InvoiceStatusEnum.ReadyForExport,
        ],
        action: InvoiceActionButton.Cancel,
      },
    ];

    const filterVisibleItems = (items: any[]): MenuItem[] =>
      items
        .filter(
          (item) =>
            (!item.visibleIn ||
              item.visibleIn.includes(this.currentQueue) ||
              item.visibleIn.includes(this.currentStatus)) &&
            (!item.permission || this._permissions.includes(item.permission))
        )
        .map(({ visibleIn, ...rest }) => ({
          ...rest,
          ...(rest.items ? { items: filterVisibleItems(rest.items) } : {}),
        }));

    this.items = filterVisibleItems(menuDefinitions);
  }

  onSave() {
    this.formService.triggerSave();
  }

  onSubmit() {
    this.formService.triggerSubmit();
  }

  onValidate() {
    this.formService.triggerValidate();
  }
  onCancel() {
    setTimeout(() => {
      this.formService.triggerCancel();
    }, 0);
  }

  onOpenPurchaseOrder() {
    this.formService.triggerOpenPurchaseOrder();
  }

  onOpenAddComment() {
    this.formService.triggerOpenAddCommentDialog();
  }

  onOpenInvAttachment() {
    this.formService.triggerOpenInvAttachmentDialog();
  }
  onOpenInvoiceActivityLog() {
    this.formService.triggerOpenInvActivityLogDialog();
  }
}
