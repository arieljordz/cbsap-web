import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ResponseResult } from '../../model/common';

import { ErrorHandlerService, ResultsHttpService } from '../index';
import { AssignedInvoice, AssignedInvoiceResult } from '../../model/dashboard/assigned-invoice.model';
import {
  DASHBOARD_ASSIGNEDINVOICE,
  DASHBOARD_NOTICE,  
} from '../../constants/dashboard/dashboard-constants';
import { HttpErrorResponse } from '@angular/common/http';
import { Notice } from '../../model/dashboard/notice.model';
import { CreateNotice } from '../../model/dashboard/index';
import { UpdateNotice } from '../../model/dashboard/update-notice.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private httpClient: ResultsHttpService,
    private errorHandlingService: ErrorHandlerService
  ) {}

  getAssignedInvoices(filterType: string): Observable<ResponseResult<AssignedInvoiceResult>> {
    return this.httpClient
      .get<AssignedInvoiceResult>(`${DASHBOARD_ASSIGNEDINVOICE}?filterType=${filterType}`, true)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorHandlingService.handleError(error);
          return throwError(() => error);
        })
      );
  }

  createNotice(notice: CreateNotice): Observable<ResponseResult<string>> {
    return this.httpClient
      .post<string>(`${DASHBOARD_NOTICE}`, notice, true) //todo : need actual endpoint
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorHandlingService.handleError(error);
          return throwError(() => error);
        })
      );
  }
  updateNotice(notice: UpdateNotice): Observable<ResponseResult<string>> {
    return this.httpClient
      .put<string>(`${DASHBOARD_NOTICE}`, notice, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorHandlingService.handleError(error);
          return throwError(() => error);
        })
      );
  }

  getNotices(): Observable<ResponseResult<Notice[]>> {
    return this.httpClient.get<Notice[]>(`${DASHBOARD_NOTICE}`, true).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorHandlingService.handleError(error);
        return throwError(() => error);
      })
    );
  }
}
