
export interface Keyword {
  keywordID:number;
  entityProfileID?: number;
  entityName:string;
  keywordName: string;
  invoiceRoutingFlowID:number;
  invoiceRoutingFlowName:string;
  isActive:boolean;
}

export interface KeywordGridQuery {
  keywordName: string;
  entityName: string;
  invoiceRoutingFlowName: string;
  isActive?: boolean | null;
  pageNumber: number | 1;
  pageSize: number | 10;
  sortField?: string;
  sortOrder?: number | null;
}


export interface KeywordSearchModel {
  entityName: string;
  invoiceRoutingFlowName: string;
  keywordName: string;
  isActive?: boolean | null;
}

export interface ExportKeywordQuery {
  entityName: string;
  invoiceRoutingFlowName: string;
  keywordName: string;
}
