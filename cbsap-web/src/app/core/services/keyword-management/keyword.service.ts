import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Pagination, ResponseResult } from '../../model/common';
import {  ExcelService, ResultsHttpService } from '../index';
import { HttpErrorResponse } from '@angular/common/http';
import { KEYWORD_MANAGEMENT, KEYWORD_PAGEDGRID } from '@core/constants';
import { ExportKeywordQuery, Keyword, KeywordGridQuery } from '@core/model/keyword-management/index';

@Injectable({
  providedIn: 'root',
})
export class KeywordService {
  constructor(
    private httpClient: ResultsHttpService,
    private excelService: ExcelService,
  ) {}

  createKeyword(keyword: Keyword): Observable<ResponseResult<string>> {
    return this.httpClient
      .post<string>(`${KEYWORD_MANAGEMENT}`, keyword, true)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  deleteKeyword(keywordId: number): Observable<ResponseResult<string>> {
    return this.httpClient
      .delete<string>(`${KEYWORD_MANAGEMENT}/${keywordId}`, true) 
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
    }

  updateKeyword(
    keyword: Keyword,
    keywordId: number
  ): Observable<ResponseResult<string>> {
    return this.httpClient
      .put<string>(`${KEYWORD_MANAGEMENT}/${keywordId}`, keyword, true)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getKeywordById(keywordId: Number) : Observable<ResponseResult<Keyword>> {
    return this.httpClient
      .get<Keyword>(`${KEYWORD_MANAGEMENT}/${keywordId}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error)
        })
      )
  }

  getKeywords(keywordGridQuery: KeywordGridQuery): Observable<ResponseResult<Pagination<Keyword>>> {
    return this.httpClient
      .getSearchWithPagination<Keyword>(
        `${KEYWORD_PAGEDGRID}?${this.httpClient.serialiazeQueryString(keywordGridQuery)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  exportKeyword(exportKeywordQuery: ExportKeywordQuery): Observable<ResponseResult<Blob>> {
      return this.excelService
        .exportExcelReport(
          `${KEYWORD_MANAGEMENT}/download?${this.httpClient.serialiazeQueryString(exportKeywordQuery)}`,
          true
        )
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
          })
        );
    }
}
