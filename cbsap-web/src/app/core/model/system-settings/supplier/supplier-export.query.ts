export interface SupplierExportQuery{
    EntityName : string;
    SupplierID : string;
    SupplierName : string;
    IsActive? : boolean | null;
}