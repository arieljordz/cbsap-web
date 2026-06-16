import { Injectable } from '@angular/core';
import { HttpErrorResponse, INV_ROUTINGFLOW } from '@core/constants';
import { Pagination, ResponseResult } from '@core/model/common';
import { AssignRoleCommand } from '@core/model/invoicing/invoice-routing-flow/commands/assign-role-command';
import { RemoveAssignedRoleCommand } from '@core/model/invoicing/invoice-routing-flow/commands/remove-assigned-role-command';
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
  assignRole(
    assignRoleCommand: AssignRoleCommand
  ): Observable<ResponseResult<string>> {
    return this.resultHttpClient
      .post<string>(`${INV_ROUTINGFLOW}/roles/assign`, assignRoleCommand, true)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

 

  removeAssignedRole(
    removeRoleCommand: RemoveAssignedRoleCommand
  ): Observable<ResponseResult<string>> {
    return this.resultHttpClient
      .post<string>(`${INV_ROUTINGFLOW}/roles/remove`, removeRoleCommand, true)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error removing assigned role', error);
          return throwError(() => error);
        })
      );
  }
}
