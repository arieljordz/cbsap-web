import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import {
  HttpErrorResponse,
  OPERATIONS,
  PERMISSION,
} from '../../constants/index';
import {
  GroupPanelDTO,
  PermissionCommand,
  PermissionDetailDTO,
  PermissionSearchByIdDTO,
  PermissionSearchDTO,
  SearchPermissionParamQuery,
  UpdatePermissionCommand,
  ExportPermissionQuery
} from '../../model/permission-management/index';
import { ErrorHandlerService, ExcelService, HttpService, ResultsHttpService } from '../index';
import {
  Pagination,
  ResponseResult,
  ResultObject,
} from './../../model/common/index';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(
    private httpClient: HttpService, 
    private resultHttpClient: ResultsHttpService,
    private errorHandlingService: ErrorHandlerService,
    private excelService : ExcelService,
  ) {}

  //Get all the permission Operations for new permission

  getAllOperation(): Observable<ResponseResult<GroupPanelDTO[]>> {
    return this.resultHttpClient.get<GroupPanelDTO[]>(`${OPERATIONS}`, true).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandlingService.handleError(error);
        return throwError(() => error);
      })
    );
  }

  getallPermission(): Observable<ResponseResult<PermissionDetailDTO[]>> {
    return this.resultHttpClient
      .get<PermissionDetailDTO[]>(`${PERMISSION}/active-permissions`, true)
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
  selectedPermissionByRole(roleID : number ): Observable<ResponseResult<PermissionDetailDTO[]>> {
    return this.resultHttpClient
      .get<PermissionDetailDTO[]>(`${PERMISSION}/${roleID}/role-permissions`, true)
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

  availablePermissionForRole(roleID : number ): Observable<ResponseResult<PermissionDetailDTO[]>> {
    return this.resultHttpClient
      .get<PermissionDetailDTO[]>(`${PERMISSION}/${roleID}/available-permissions`, true)
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

  searchPermission(
    query: SearchPermissionParamQuery
  ): Observable<ResponseResult<Pagination<PermissionSearchDTO>>> {
    return this.resultHttpClient
      .getSearchWithPagination<PermissionSearchDTO>(
        `${PERMISSION}/paged?${this.httpClient.serialiazeQueryString(query)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  searchPermissionbyID(
    permissionID: number
  ): Observable<ResponseResult<PermissionSearchByIdDTO[]>> {
    return this.resultHttpClient
      .get<PermissionSearchByIdDTO[]>(`${PERMISSION}/${permissionID}`, true)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorHandlingService.handleError(error);
          return throwError(() => error);
        })
      );
  }

  savePermission(
    createPermissionCommand: PermissionCommand
  ): Observable<ResponseResult<string>> {
    return this.resultHttpClient
      .post<string>(`${PERMISSION}`, createPermissionCommand, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updatePermission(
    updatePermissionCommand: UpdatePermissionCommand
  ): Observable<ResponseResult<string>> {
    return this.resultHttpClient
      .put<string>(`${PERMISSION}`, updatePermissionCommand, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
         
          return throwError(() => error);
        })
      );
  }

  exportPermission(
    query: ExportPermissionQuery
  ): Observable<ResponseResult<Blob>> {
     return  this.excelService.exportExcelReport
      (
        `${PERMISSION}/download?${this.resultHttpClient.serialiazeQueryString(query)}`,
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
