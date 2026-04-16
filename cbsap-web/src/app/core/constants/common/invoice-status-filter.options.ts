import { InvoiceStatusEnum } from "@core/enums/invoice.enum";
import { SelectItem  } from "primeng/api";

export function getInvoiceStatusFilterOptions() : SelectItem[] {
  return [
    { label: 'All', value: null },
    { label: 'Validation', value: InvoiceStatusEnum.Validation },
    { label: 'Exception', value: InvoiceStatusEnum.Exception },
    { label: 'Exception On Hold', value: InvoiceStatusEnum.ExceptionOnHold },
    { label: 'For Approval', value: InvoiceStatusEnum.ForApproval },
    { label: 'Approval On Hold', value: InvoiceStatusEnum.ApprovalOnHold },
    { label: 'Rejected', value: InvoiceStatusEnum.Rejected },
    { label: 'Ready For Export', value: InvoiceStatusEnum.ReadyForExport },
    { label: 'Exported', value: InvoiceStatusEnum.Exported },
    { label: 'Approved', value: InvoiceStatusEnum.Approved },
    { label: 'Archived', value: InvoiceStatusEnum.Archived },
  ];
}