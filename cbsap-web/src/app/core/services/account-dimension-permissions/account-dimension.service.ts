import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import {
  HttpErrorResponse,
  ACCOUNT_DIMENSION,
} from '../../constants';

import {
  AccountDimensionSearchByIdDTO,
  AccountDimensionSearchDTO,
  SearchAccountDimensionParamQuery,
} from '../../model/account-dimension-permission';

import {
  ErrorHandlerService,
  HttpService,
  ResultsHttpService,
} from '../index';

import {
  Pagination,
  ResponseResult,
} from '../../model/common';

@Injectable({
  providedIn: 'root',
})
export class AccountDimensionService {
  constructor(
    private httpClient: HttpService,
    private resultHttpClient: ResultsHttpService,
    private errorHandlingService: ErrorHandlerService
  ) {}

  searchAccountDimension(
    query: SearchAccountDimensionParamQuery
  ): Observable<
    ResponseResult<Pagination<AccountDimensionSearchDTO>>
  > {
    return this.resultHttpClient
      .getSearchWithPagination<AccountDimensionSearchDTO>(
        `${ACCOUNT_DIMENSION}/paged?${this.httpClient.serialiazeQueryString(
          query
        )}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorHandlingService.handleError(error);
          return throwError(() => error);
        })
      );
  }

  searchAccountDimensionById(
    roleId: number
  ): Observable<
    ResponseResult<AccountDimensionSearchByIdDTO[]>
  > {
    return this.resultHttpClient
      .get<AccountDimensionSearchByIdDTO[]>(
        `${ACCOUNT_DIMENSION}/${roleId}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorHandlingService.handleError(error);
          return throwError(() => error);
        })
      );
  }
}