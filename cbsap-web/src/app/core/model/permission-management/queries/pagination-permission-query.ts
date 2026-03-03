export interface SearchPermissionParamQuery {

    PermissionID? : number |null;
    PermissionName?: string;
    IsActive?:boolean | null
    PageNumber: number | 1;
    PageSize: number | 10;
    SortField?: string;
    SortOrder?: number | null;

}