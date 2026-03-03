
export interface TaxCode {  
  taxCodeID:number;
  entityID: number;
  entityName:string;
  taxCodeName: string;
  code:string;
  taxRate:number; 
}

export interface TaxCodeGridQuery {
  EntityName: string,
  TaxCodeName: string,
  TaxCode: string,
  pageNumber: number | 1;
  pageSize: number | 10;
  sortField?: string;
  sortOrder?: number | null;
}

export interface ExportTaxCodesQuery {
  entityName: string,
  taxCodeName: string,
  code: string
}

export interface TaxCodeSearchModel {
  entityName: string;
  taxCodeName: string;
  taxCode: string;
}