export interface SearchSupplierQuery{
    EntityName: string;
    SupplierID : string;
    SupplierName : string;
    IsActive? : boolean | null;
    PageNumber: number | 1;
    PageSize: number | 10;
    SortField?: string;
    SortOrder?: number | null;
}
