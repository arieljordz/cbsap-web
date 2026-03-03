export interface EntitySearchDto {
    entityProfileID: number;
    entityName: string;
    entityCode: string;
    emailAddress: string;
    taxID: string;
}

export interface EntitySearchFilters {
  EntityName?: string;
  EntityCode?: string;
}