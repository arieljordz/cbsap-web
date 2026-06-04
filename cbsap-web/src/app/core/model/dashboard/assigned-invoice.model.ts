import { Toast } from 'primeng/toast';

export interface AssignedInvoice {  
  invoiceId: number;
  queue:string;
  invoiceNumber: string;
  supplierName: string;
  invoiceDate: string;
  dueDate: string;
  amount:number;  
  assignedRole: string;  
}

export interface AssignedInvoiceResult {
  invoices: AssignedInvoice[];
  overdueCount: number;
  totalCount: number;
} 