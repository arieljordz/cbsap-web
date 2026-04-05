import { Injectable } from '@angular/core';
import { ResultsHttpService } from '../common/results-http.service';
import { Pagination, ResponseResult } from '../../model/common';
import {
  AccountLookupDto,
  InvRoutingFlowLookupDto,
  InvSearchSupplierDto,
  InvSupplierLookUpQuery,
  RoutingFlowLookupDto,
  RoutingFlowLookupQuery,
} from '../../model/invoicing/invoicing.index';
import {
  ACCOUNTS,
  HttpErrorResponse,
  ROUTING_FLOWS,
  TAX_CODES,
  SUPPLIER_LOOKUP,
  ROLES_LOOKUP,
  INV_SUPPLIER_LOOKUP,
  ACCOUNT_SEARCH_LOOKUP,
  ACCOUNT_EXPORT,
  DIMENSION_SEARCH_LOOKUP,
  DIMENSION_EXPORT,
  GOODS_RECEIPT_SEARCH_LOOKUP,
  GOODS_RECEIPT_EXPORT,
  ROUTING_FLOWS_LOOKUP
} from '../../constants';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TaxCodeLookupDto } from '../../model/taxcode-management';
import { SupplierLookUpDto } from '@core/model/system-settings/supplier/supplier.index';
import { RoleDTO } from '@core/model/roles-management';
import { ExportAccountsQuery, SearchAccountLookUpQuery } from '@core/model/accounts/search-account.querry';
import { SearchAccountLookupDto } from '@core/model/accounts/search-account.dto';
import { SearchDimensionLookupDto } from '@core/model/dimension/search-dimension.dto';
import { ExportDimensionsQuery, SearchDimensionQuery } from '@core/model/dimension/search-dimension.query';
import { SearchGoodsReceiptLookupDto } from '@core/model/goods-receipt/search-goods-receipt.dto';
import { ExportGoodsReceiptsQuery, SearchGoodsReceiptQuery } from '@core/model/goods-receipt/search-goods-receipt.query';
import { ExcelService } from '../util-services/excel.service';

@Injectable({
  providedIn: 'root',
})
export class LookUpsService {
  constructor(private resultHttpClient: ResultsHttpService,
      private excelService: ExcelService,
      private httpClient: ResultsHttpService) {}

  getAccountLookUps(): Observable<ResponseResult<AccountLookupDto[]>> {
    return this.resultHttpClient
      .get<AccountLookupDto[]>(`${ACCOUNTS}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  getRolesLookUps(): Observable<ResponseResult<RoleDTO[]>> {
    return this.resultHttpClient.get<RoleDTO[]>(`${ROLES_LOOKUP}`, true).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getInvRoutingFlowLookUps(): Observable<
    ResponseResult<InvRoutingFlowLookupDto[]>
  > {
    return this.resultHttpClient
      .get<InvRoutingFlowLookupDto[]>(`${ROUTING_FLOWS}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getInvRoutingFlowByEntityIDLookUps(entityId:number): Observable<
    ResponseResult<InvRoutingFlowLookupDto[]>
  > {
    return this.resultHttpClient
      .get<InvRoutingFlowLookupDto[]>(`${ROUTING_FLOWS}/${entityId}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getTaxCodeLookUps(): Observable<ResponseResult<TaxCodeLookupDto[]>> {
    return this.resultHttpClient
      .get<TaxCodeLookupDto[]>(`${TAX_CODES}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  getSupplierLookUps(): Observable<ResponseResult<SupplierLookUpDto[]>> {
    return this.resultHttpClient
      .get<SupplierLookUpDto[]>(`${SUPPLIER_LOOKUP}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  invSearchSupplierLookUp(
    query: InvSupplierLookUpQuery
  ): Observable<ResponseResult<Pagination<InvSearchSupplierDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<InvSearchSupplierDto>(
        `${INV_SUPPLIER_LOOKUP}?${this.resultHttpClient.serialiazeQueryString(
          query
        )}`,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  routingFlowSearchLookUp(
    query: RoutingFlowLookupQuery
  ): Observable<ResponseResult<Pagination<RoutingFlowLookupDto>>>{
    return this.resultHttpClient
      .getSearchWithPagination<RoutingFlowLookupDto>(
        `${ROUTING_FLOWS_LOOKUP}?${this.resultHttpClient.serialiazeQueryString(
          query
        )}`,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  accountSearchLookUp(
    query: SearchAccountLookUpQuery
  ): Observable<ResponseResult<Pagination<SearchAccountLookupDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<SearchAccountLookupDto>(
        `${ACCOUNT_SEARCH_LOOKUP}?${this.resultHttpClient.serialiazeQueryString(
          query
        )}`,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  exportAccounts(exportTaxCodesQuery: ExportAccountsQuery): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${ACCOUNT_EXPORT}?${this.httpClient.serialiazeQueryString(exportTaxCodesQuery)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  dimensionSearchLookUp(
    query: SearchDimensionQuery
  ): Observable<ResponseResult<Pagination<SearchDimensionLookupDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<SearchDimensionLookupDto>(
        `${DIMENSION_SEARCH_LOOKUP}?${this.resultHttpClient.serialiazeQueryString(
          query
        )}`,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  exportDimensions(exportDimensionsQuery: ExportDimensionsQuery): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${DIMENSION_EXPORT}?${this.httpClient.serialiazeQueryString(exportDimensionsQuery)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  goodsReceiptSearchLookUp(
    query: SearchGoodsReceiptQuery
  ): Observable<ResponseResult<Pagination<SearchGoodsReceiptLookupDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<SearchGoodsReceiptLookupDto>(
        `${GOODS_RECEIPT_SEARCH_LOOKUP}?${this.resultHttpClient.serialiazeQueryString(
          query
        )}`,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  exportGoodsReceipts(exportGoodsReceiptsQuery: ExportGoodsReceiptsQuery): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${GOODS_RECEIPT_EXPORT}?${this.httpClient.serialiazeQueryString(exportGoodsReceiptsQuery)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
}
