export interface SearchEntityQuery{
    EntityName? : string;
    EntityCode? : string;
    PageNumber: number | 1;
    PageSize: number | 10;
    SortField?: string;
    SortOrder?: number | null;
}
