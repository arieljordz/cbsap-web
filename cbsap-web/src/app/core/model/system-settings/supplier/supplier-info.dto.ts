export interface SupplierInfoDto {
    supplierInfoID : number ;
    supplierID : string | null;
    supplierTaxID : string | null;
    entityProfileID : number | null;
    supplierName : string | null;
    isActive : boolean;

    telephone : string | null;
    emailAddress : string | null;
    contact : string | null;
    addressLine1 : string | null;
    addressLine2 : string | null;
    addressLine3 : string | null;
    addressLine4 : string | null;
    addressLine5 : string | null;
    addressLine6 : string | null;
 
    accountID : number | null;  
    taxCodeID : number | null;  
    currency: string | null;
    paymentTerms: string | null;

    invRoutingFlowID : number | null; 

    freeField1 : string | null;
    freeField2 : string | null;
    freeField3 : string | null;
  
    notes : string | null
}


 export interface SupplierLookUpDto {
    supplierInfoID: number;
    supplierName: string ;
}