import { Toast } from 'primeng/toast';

export interface AssignedInvoice {  
  invoiceId: number;
  invoiceNumber: string;
  supplierName: string;
  invoiceDate: string;
  dueDate: string;
  amount:number;  
  assignedRole: string; 
  assignedRoleId: number;
}

export interface AssignedInvoiceResult {
  invoices: AssignedInvoice[];
  overdueCount: number;
  totalCount: number;
} 