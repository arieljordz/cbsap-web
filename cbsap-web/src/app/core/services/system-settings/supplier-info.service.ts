import { SelectItem } from 'primeng/api';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResultsHttpService } from '@core/services/common/results-http.service';
import { ErrorHandlerService } from '@core/services/common/error-handler.service';
import { ExcelService } from '@core/services/util-services/excel.service';
import { SupplierInfoDropdownDto } from '@core/model/system-settings/supplier/supplier-info-dropdown.dto';
import {
  SupplierInfoDto,
  SearchSupplierQuery,
  SupplierExportQuery,
  SupplierSearchDto,
} from '@core/model/system-settings/supplier/supplier.index';
import { Pagination, ResponseResult } from '@core/model/common';
import { HttpErrorResponse, SUPPLIER } from '@core/constants';

@Injectable({
  providedIn: 'root',
})
export class SupplierInfoService {
  private dropdownSupplierData$?: Observable<{
    currencies: SelectItem[];
    paymentTerms: SelectItem[];
  }>;
  constructor(
    private httpClient: HttpClient,
    private resultHttpClient: ResultsHttpService,
    private errorHandlingService: ErrorHandlerService,
    private excelService: ExcelService
  ) {}

  getDropdownOptions(): Observable<{
    currencies: SelectItem[];
    paymentTerms: SelectItem[];
  }> {
    if (!this.dropdownSupplierData$) {
      this.dropdownSupplierData$ = this.httpClient
        .get<SupplierInfoDropdownDto>('assets/entity-options.json')
        .pipe(
          map((data) => ({
            currencies: data.currencies,
            paymentTerms: data.paymentTerms,
          })),
          shareReplay(1)
        );
    }
    return this.dropdownSupplierData$;
  }

  createSupplier(
    supplier: SupplierInfoDto
  ): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .post<boolean>(`${SUPPLIER}`, supplier, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  updateSuppler(
    supplier: SupplierInfoDto
  ): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .put<boolean>(`${SUPPLIER}`, supplier, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  getSupplierByID(
    supplierInfoID: number
  ): Observable<ResponseResult<SupplierInfoDto>> {
    return this.resultHttpClient
      .get<SupplierInfoDto>(`${SUPPLIER}/${supplierInfoID}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  private toSelectItems(items: string[]): SelectItem[] {
    return items.map((value) => ({
      label: value,
      value: value,
    }));
  }

  searchSupplier(
    query: SearchSupplierQuery
  ): Observable<ResponseResult<Pagination<SupplierSearchDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<SupplierSearchDto>(
        `${SUPPLIER}/paged?${this.resultHttpClient.serialiazeQueryString(
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
  exportSupplier(query: SupplierExportQuery): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${SUPPLIER}/download?${this.resultHttpClient.serialiazeQueryString(
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

  deleteSupplier(supplierInfoID: number): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .delete<boolean>(`${SUPPLIER}/${supplierInfoID}`, supplierInfoID, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
}
