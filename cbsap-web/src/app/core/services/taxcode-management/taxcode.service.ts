import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Pagination, ResponseResult } from '../../model/common';
import { ErrorHandlerService, ExcelService, ResultsHttpService } from '../index';
import { TAXCODE_MANAGEMENT, TAXCODE_PAGEDGRID } from '../../constants/taxcode-management/taxcode-management-constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ExportTaxCodesQuery, TaxCode, TaxCodeGridQuery } from '../../model/taxcode-management/index';

@Injectable({
  providedIn: 'root',
})
export class TaxCodeService {
  constructor(
    private httpClient: ResultsHttpService,
    private excelService: ExcelService,
    private errorHandlingService: ErrorHandlerService
  ) {}

  createTaxCode(taxCode: TaxCode): Observable<ResponseResult<string>> {
    return this.httpClient
      .post<string>(`${TAXCODE_MANAGEMENT}`, taxCode, true)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  updateTaxCode(
    taxCode: TaxCode,
    taxCodeId: number
  ): Observable<ResponseResult<string>> {
    return this.httpClient
      .put<string>(`${TAXCODE_MANAGEMENT}/${taxCodeId}`, taxCode, true)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getTaxCodeById(taxCodeId: Number) : Observable<ResponseResult<TaxCode>> {
    return this.httpClient
      .get<TaxCode>(`${TAXCODE_MANAGEMENT}/${taxCodeId}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error)
        })
      )
  }

  getTaxCodes(taxCodeGridQuery: TaxCodeGridQuery): Observable<ResponseResult<Pagination<TaxCode>>> {
    return this.httpClient
      .getSearchWithPagination<TaxCode>(
        `${TAXCODE_PAGEDGRID}?${this.httpClient.serialiazeQueryString(taxCodeGridQuery)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  exportTaxCodes(exportTaxCodesQuery: ExportTaxCodesQuery): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${TAXCODE_MANAGEMENT}/download?${this.httpClient.serialiazeQueryString(exportTaxCodesQuery)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
}
