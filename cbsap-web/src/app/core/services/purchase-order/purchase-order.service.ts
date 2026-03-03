import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@core/constants';
import { PO_ENDPOINT } from '@core/constants/purchase-order/purchase-order.constants';
import { Pagination, ResponseResult } from '@core/model/common';
import {
  SavePOMatchingDto,
  SearchPoLinesDto,
} from '@core/model/purchase-order/po-lines.dto';
import { SearchPOLinesQuery } from '@core/model/purchase-order/po-lines.query';
import { POSearchDto } from '@core/model/purchase-order/po-search.dto';
import {
  ExportPOSearchQuery,
  POSearchQuery,
} from '@core/model/purchase-order/po.query';
import { ResultsHttpService } from '@core/services/common/results-http.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ExcelService } from '../util-services/excel.service';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  constructor(
    private resultHttpClient: ResultsHttpService,
    private excelService: ExcelService
  ) {}

  /**PO LINES */
  searchPOLines(
    query: SearchPOLinesQuery
  ): Observable<ResponseResult<SearchPoLinesDto[]>> {
    return this.resultHttpClient
      .get<SearchPoLinesDto[]>(
        `${
          PO_ENDPOINT.GET_POLINES_SEARCH
        }${this.resultHttpClient.serialiazeQueryString(query)}`,
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

  savePOMatching(
    savePOMatchingDto: SavePOMatchingDto
  ): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .post<boolean>(`${PO_ENDPOINT.SAVE_PO_MATCHING}`, savePOMatchingDto, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  recalculatePOLine(
    savePOMatchingDto: SavePOMatchingDto
  ): Observable<ResponseResult<SearchPoLinesDto[]>> {
    return this.resultHttpClient
      .post<SearchPoLinesDto[]>(
        `${PO_ENDPOINT.RECALCULATE_POLINES}`,
        savePOMatchingDto,
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

  updatePOMatching(
    savePOMatchingDto: SavePOMatchingDto
  ): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .put<boolean>(
        `${PO_ENDPOINT.UPDATE_PO_MATCHING}`,
        savePOMatchingDto,
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

  getInvoiceByInvID(
    poNo: string,
    invoiceID: number
  ): Observable<ResponseResult<SearchPoLinesDto[]>> {
    return this.resultHttpClient
      .get<SearchPoLinesDto[]>(
        PO_ENDPOINT.GET_PO_MATCHING_BY_INVID(poNo, invoiceID),
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

  getPOLineUsage(
    purchaseOrderLineID: number
  ): Observable<ResponseResult<number>> {
    return this.resultHttpClient
      .get<number>(
        PO_ENDPOINT.GET_PURCHASE_ORDERLINE_USAGE(purchaseOrderLineID),
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
  poSearch(
    query: POSearchQuery
  ): Observable<ResponseResult<Pagination<POSearchDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<POSearchDto>(
        `${PO_ENDPOINT.PO_SEARCH}?${this.resultHttpClient.serialiazeQueryString(
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

  exportPO(
    exportExceptionQuery: ExportPOSearchQuery
  ): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${
          PO_ENDPOINT.EXPORT_SEARCH
        }${this.resultHttpClient.serialiazeQueryString(exportExceptionQuery)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
}
