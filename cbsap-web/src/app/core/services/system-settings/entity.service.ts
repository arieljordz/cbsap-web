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
import { ENTITYPROFILE, HttpErrorResponse } from '../../constants';
import { ErrorHandlerService } from '../common/error-handler.service';
import { ExcelService } from '../util-services/excel.service';
import { GetAllEntityDto } from '../../model/entity-profile';

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  private drowpdownEntityData$?: Observable<{
    matchingLevel: SelectItem[];
    invoiceMatchBasis: SelectItem[];
    allowPresets: SelectItem[];
  }>;

  constructor(
    private httpClient: HttpClient,
    private resultHttpClient: ResultsHttpService,
    private errorHandlingService: ErrorHandlerService,
    private excelService: ExcelService
  ) {}

  getDropdownOptions(): Observable<{
    matchingLevel: SelectItem[];
    invoiceMatchBasis: SelectItem[];
    allowPresets: SelectItem[];
  }> {
    if (!this.drowpdownEntityData$) {
      this.drowpdownEntityData$ = this.httpClient
        .get<EntityDropdownDto>('assets/entity-options.json')
        .pipe(
          map((data) => ({
            matchingLevel: this.toSelectItems(data.matchingLevel),
            invoiceMatchBasis: this.toSelectItems(data.invoiceMatchBasis),
            allowPresets: data.allowPresets,
          })),
          shareReplay(1)
        );
    }
    return this.drowpdownEntityData$;
  }
  private toSelectItems(items: string[]): SelectItem[] {
    return items.map((value) => ({
      label: value,
      value: value,
    }));
  }

  getEntityByID(
    entityProfileID: Number
  ): Observable<ResponseResult<EntityProfileDto>> {
    return this.resultHttpClient
      .get<EntityProfileDto>(`${ENTITYPROFILE}/${entityProfileID}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  createEntity(entity: EntityProfileDto): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .post<boolean>(`${ENTITYPROFILE}/entity`, entity, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  updateEntity(entity: EntityProfileDto): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .put<boolean>(`${ENTITYPROFILE}/entity`, entity, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  searchEntity(
    query: SearchEntityQuery
  ): Observable<ResponseResult<Pagination<EntitySearchDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<EntitySearchDto>(
        `${ENTITYPROFILE}/entity/paged?${this.resultHttpClient.serialiazeQueryString(
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

  exportEntity(query: ExportEntityQuery): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${ENTITYPROFILE}/entity/download?${this.resultHttpClient.serialiazeQueryString(
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

  getAllEntities(): Observable<ResponseResult<GetAllEntityDto[]>> {
    return this.resultHttpClient
      .get<GetAllEntityDto[]>(`${ENTITYPROFILE}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

   deleteEntity(entityProfileID: number): Observable<ResponseResult<boolean>> {
      return this.resultHttpClient
        .delete<boolean>(`${ENTITYPROFILE}/${entityProfileID}`, entityProfileID, true)
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
