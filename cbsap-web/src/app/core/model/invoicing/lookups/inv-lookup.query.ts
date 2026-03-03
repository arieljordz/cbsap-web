export interface InvSupplierLookUpQuery {
    SupplierID : string;
    SupplierName : string;
    PageNumber: number | 1;
    PageSize: number | 10;
    SortField?: string;
    SortOrder?: number | null;
}