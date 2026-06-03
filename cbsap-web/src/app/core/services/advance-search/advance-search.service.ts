import { ExportEntityQuery } from './../../model/system-settings/entity/entity-export.query';
import { EntityDropdownDto } from './../../model/system-settings/entity/entity-dropdownDto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { ResultsHttpService } from '../common/results-http.service';
import { Pagination, ResponseResult } from '../../model/common';
import {
  EntityProfileDto,
  EntitySearchDto,
  SearchEntityQuery,
} from '../../model/system-settings/entity/entity.index';
import { HttpErrorResponse, INV_ENPOINT } from '../../constants';
import { ErrorHandlerService } from '../common/error-handler.service';
import { ExcelService } from '../util-services/excel.service';
import { GetAllEntityDto } from '../../model/entity-profile';
import { MyInvoiceSearchQuery } from '@core/model/invoicing/invoice/invoice.query';
import { AdvanceSearchDto } from '@core/model/advance-search/advanceSearchDto';

@Injectable({
  providedIn: 'root',
})
export class AdvanceSearchService {
  private drowpdownEntityData$?: Observable<{
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


  getAdvanceSearch(
    formName: string,
  ): Observable<ResponseResult<AdvanceSearchDto>> {
    return this.resultHttpClient
      .get<AdvanceSearchDto>(`${INV_ENPOINT.GET_ADVANCESEARCH(formName)}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  createAdvanceSearch(addAdvanceSearch: MyInvoiceSearchQuery): Observable<ResponseResult<number>> {

    console.log(addAdvanceSearch);

    return this.resultHttpClient
      .post<number>(`${INV_ENPOINT.ADD_ADVANCESEARCH}`, addAdvanceSearch, true)
      .pipe(
        map((response) => {

          
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  

  updateAdvanceSearch(advanceSearch: MyInvoiceSearchQuery): Observable<ResponseResult<number>> {
    return this.resultHttpClient
      .put<number>(`${INV_ENPOINT.UPDATE_ADVANCESEARCH}`, advanceSearch, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }


   deleteAdvanceSearch(advanceSearchId: number): Observable<ResponseResult<boolean>> {
      return this.resultHttpClient
        .delete<boolean>(`${INV_ENPOINT.DELETE_ADVANCESEARCH(advanceSearchId)}`, true)
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
