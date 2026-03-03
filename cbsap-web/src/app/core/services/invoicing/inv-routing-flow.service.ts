import { Injectable } from '@angular/core';
import { HttpErrorResponse, INV_ROUTINGFLOW } from '@core/constants';
import { Pagination, ResponseResult } from '@core/model/common';
import {
  InvoiceRoutingFlowDto,
  InvRoutingFlowExportQuery,
  SearchInvRoutingFlowByRolesQuery,
  SearchInvRoutingFlowByUserQuery,
  SearchInvRoutingFlowDto,
  SearchInvRoutingFlowQuery,
  SearchInvRoutingFlowRolesDto,
  SearchInvRoutingFlowUserDto,
} from '@core/model/invoicing/invoicing.index';
import { ExcelService, ResultsHttpService } from '@core/services/index';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvRoutingFlowService {
  constructor(
    private resultHttpClient: ResultsHttpService,
    private excelService: ExcelService
  ) {}

  getInvRoutingFlowByID(
    invRoutingFlowID: number
  ): Observable<ResponseResult<InvoiceRoutingFlowDto>> {
    return this.resultHttpClient
      .get<InvoiceRoutingFlowDto>(
        `${INV_ROUTINGFLOW}/${invRoutingFlowID}`,
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

  createInvRoutingFlow(
    invRoutingFlow: InvoiceRoutingFlowDto
  ): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .post<boolean>(`${INV_ROUTINGFLOW}`, invRoutingFlow, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  updateInvRoutingFlow(
    invRoutingFlow: InvoiceRoutingFlowDto
  ): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .put<boolean>(`${INV_ROUTINGFLOW}`, invRoutingFlow, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  deletetInvRoutingFlow(
    invRoutingFlowID: number
  ): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .delete<boolean>(`${INV_ROUTINGFLOW}/${invRoutingFlowID}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  searchInvRoutingFlow(
    query: SearchInvRoutingFlowQuery
  ): Observable<ResponseResult<Pagination<SearchInvRoutingFlowDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<SearchInvRoutingFlowDto>(
        `${INV_ROUTINGFLOW}/paged?${this.resultHttpClient.serialiazeQueryString(
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

  searchInvRoutingFlowByRoles(
    query: SearchInvRoutingFlowByRolesQuery
  ): Observable<ResponseResult<Pagination<SearchInvRoutingFlowRolesDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<SearchInvRoutingFlowRolesDto>(
        `${INV_ROUTINGFLOW}/roles/paged?${this.resultHttpClient.serialiazeQueryString(
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
  searchInvRoutingFlowByUser(
    query: SearchInvRoutingFlowByUserQuery
  ): Observable<ResponseResult<Pagination<SearchInvRoutingFlowUserDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<SearchInvRoutingFlowUserDto>(
        `${INV_ROUTINGFLOW}/users/paged?${this.resultHttpClient.serialiazeQueryString(
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

  exportInvRoutingFlow(
    query: InvRoutingFlowExportQuery
  ): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${INV_ROUTINGFLOW}/download?${this.resultHttpClient.serialiazeQueryString(
          query
        )}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
}
