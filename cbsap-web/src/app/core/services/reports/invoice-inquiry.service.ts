import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { ResultsHttpService } from '../common/results-http.service';
import { Pagination, ResponseResult } from '../../model/common';
import { ErrorHandlerService } from '../common/error-handler.service';
import { ExcelService } from '../util-services/excel.service';
import { InvoiceInquirySearchDto } from '@core/model/reports/invoice-inquiry/invoice-inquiry-searchDto';
import { ExportInvoiceInquiryQuery, InvoiceInquiryDto, SearchInvoiceInquiryQuery } from '@core/model/reports/invoice-inquiry/invoice-inquiry.index';
import { INVOICE_INQUIRY } from '@core/constants/invoice-inquiry/invoice-inquiry-constants';

@Injectable({
  providedIn: 'root',
})
export class InvoiceInquiryService {
  private drowpdownInvoiceInquiryData$?: Observable<{
    matchingLevel: SelectItem[];
    invoiceMatchBasis: SelectItem[];
    allowPresets: SelectItem[];
    dueDateCalculations: SelectItem[];

  }>;

  constructor(
    private httpClient: HttpClient,
    private resultHttpClient: ResultsHttpService,
    private errorHandlingService: ErrorHandlerService,
    private excelService: ExcelService
  ) {}

  searchInvoiceInquiry(
    query: SearchInvoiceInquiryQuery
  ): Observable<ResponseResult<Pagination<InvoiceInquirySearchDto>>> {
    return this.resultHttpClient
      .post<Pagination<InvoiceInquirySearchDto>>(
        `${INVOICE_INQUIRY}/invoice-inquiry/paged`,
        query,
        true
      )
      .pipe(
        map((response) => response),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }

    exportInvoiceInquiry(query: ExportInvoiceInquiryQuery): Observable<ResponseResult<Blob>> {
      console.log('Export Query in Service:', query);
      return this.excelService
        .exportExcelReport(
          `${INVOICE_INQUIRY}/invoice-inquiry/download?${this.resultHttpClient.serialiazeQueryString(
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



}
