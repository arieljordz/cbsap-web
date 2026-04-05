export interface InvSearchSupplierDto {
    supplierInfoID: number;
    supplierID: string | null;
    supplierTaxID: string | null;
    entity: string | null;
    supplierName: string | null;
    isActive: boolean;
    invoiceRoutingFlowID: number | null;
    invoiceRoutingFlowName: string | null;
}