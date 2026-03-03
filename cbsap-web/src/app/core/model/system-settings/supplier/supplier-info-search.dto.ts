export interface SupplierSearchDto {
    supplierInfoID: number;
    supplierID: string | null;
    supplierName: string | null;
    supplierTaxID: string | null;
    bankAccount: string | null;
    paymentTerms: string | null;
    invRoutingFlowName: string | null;
    entity: string | null;
   isActive: boolean ;
}

export interface SupplierSearchModel {
    entityName: string;
    supplierID : string;
    supplierName : string;
    isActive? : boolean | null;
}