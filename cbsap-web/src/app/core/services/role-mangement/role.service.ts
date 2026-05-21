import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import { HttpErrorResponse, ROLE_MANAGEMENT } from '@core/constants/index';
import { ResponseResult } from '@core/model/common/index';

import { Role } from '@core/model/user-management/role.model';
import { ErrorHandlerService, ExcelService, HttpService, ResultsHttpService } from '../index';

import { Pagination } from '@core/model/common';
import {
  CreateRoleCommand,
  GetActiveRolesQuery,
  GetRoleManagerQuery,
  ReminderNotificationDTO,
  RoleDTO,
  RoleDto,
  RoleManagerDTO,
  RolePermissionDto,
  RoleSearchDTO,
  SearchRolePaginationParamQuery,
  UpdateRoleCommand,
} from '@core/model/roles-management/index';
import { } from '@core/model/user-management';
import { ExportRolesQuery } from '@core/model/roles-management/dtos/ExportRolesQuery';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(
    private httpClient: HttpService,
    private resultHttpClient: ResultsHttpService,
    private excelService: ExcelService
  ) {}

 
  getRoles(): Observable<ResponseResult<Role[]>> {
    return this.resultHttpClient.get<Role[]>(`${ROLE_MANAGEMENT}`, true).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
  getRolesByID(roleID: number): Observable<ResponseResult<RoleDto>> {
    return this.resultHttpClient
      .get<RoleDto>(`${ROLE_MANAGEMENT}/${roleID}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getRolesByUserName(userName: string): Observable<ResponseResult<RoleDTO[]>> {
    return this.resultHttpClient
      .get<RoleSearchDTO[]>(`${ROLE_MANAGEMENT}/active/${userName}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }


  getRoleManager(
    query: GetRoleManagerQuery
  ): Observable<ResponseResult<RoleManagerDTO[]>> {
    return this.resultHttpClient
      .get<RoleManagerDTO[]>(
        `${ROLE_MANAGEMENT}/role-managers?${this.httpClient.serialiazeQueryString(
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

  searchRoles(
    query: SearchRolePaginationParamQuery
  ): Observable<ResponseResult<Pagination<RoleSearchDTO>>> {
    return this.resultHttpClient
      .getSearchWithPagination<RoleSearchDTO>(
        `${ROLE_MANAGEMENT}/paged?${this.httpClient.serialiazeQueryString(
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
  getRoleReminder(
    roleID: number
  ): Observable<ResponseResult<ReminderNotificationDTO[]>> {
    return this.resultHttpClient
      .get<ReminderNotificationDTO[]>(
        `${ROLE_MANAGEMENT}/reminder/${roleID}`,
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

  getRolePermissionsByRoleId(
    roleID: number
  ): Observable<ResponseResult<RolePermissionDto[]>> {
    return this.resultHttpClient
      .get<RolePermissionDto[]>(
        `${ROLE_MANAGEMENT}/${roleID}/permissions`,
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

  saveRole(
    createRoleCommand: CreateRoleCommand
  ): Observable<ResponseResult<string>> {
    return this.resultHttpClient
      .post<string>(`${ROLE_MANAGEMENT}`, createRoleCommand, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  updateRole(
    updateRoleCommand: UpdateRoleCommand
  ): Observable<ResponseResult<string>> {
    return this.resultHttpClient
      .put<string>(`${ROLE_MANAGEMENT}`, updateRoleCommand, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  searchActiveRoles(
    query: GetActiveRolesQuery
  ): Observable<ResponseResult<RoleManagerDTO[]>> {
    return this.resultHttpClient
      .get<RoleManagerDTO[]>(
        `${ROLE_MANAGEMENT}/search?${this.httpClient.serialiazeQueryString(
          query
        )}`,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  exportRoles(exportTaxCodesQuery: ExportRolesQuery): Observable<ResponseResult<Blob>> {
      return this.excelService
        .exportExcelReport(
          `${ROLE_MANAGEMENT}/download?${this.httpClient.serialiazeQueryString(exportTaxCodesQuery)}`,
          true
        )
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
          })
        );
    }
}
