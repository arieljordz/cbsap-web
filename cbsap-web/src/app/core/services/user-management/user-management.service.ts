import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import { SearchUserQuery } from '@core/model/user-management/search-user-query';

//
import { HttpErrorResponse, USER_MANAGEMENT } from '../../constants/index';
import { ResultObject } from '@core/model/common/index';

import {
  ActiveUsersDTO,
  CreateUserDTO,
  UpdateUserDTO,
  User,
  UserSearchPaginationDTO,
} from 'src/app/core/model/user-management/index';
import { ErrorHandlerService, ExcelService, HttpService, ResultsHttpService } from '../index';

import { ResponseResult } from '@core/model/common';
import { Pagination } from '@core/model/common/pagination';
import { LockUnlockUserDTO } from '@core/model/user-management/dtos/LockUnlockUserDTO';
import { ExportUsersDTO } from '@core/model/user-management/dtos/ExportUsersDTO';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  constructor(
    private httpClient: HttpService, // to be remove  on bug fix
    private excelService: ExcelService,
    private resulthttpClient: ResultsHttpService,
    private errorHandlingService: ErrorHandlerService
  ) {}

  createUser(createUserDTO: CreateUserDTO): Observable<ResponseResult<string>> {
    return this.resulthttpClient
      .post<string>(`${USER_MANAGEMENT}`, createUserDTO, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  updateUser(updateUser: UpdateUserDTO): Observable<ResponseResult<string>> {
    return this.resulthttpClient
      .put<string>(`${USER_MANAGEMENT}`, updateUser, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getUsers(): Observable<ResultObject<User[]>> {
    return this.httpClient.get<User[]>(`${USER_MANAGEMENT}`, true).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getActiveUsers(): Observable<ResponseResult<ActiveUsersDTO[]>> {
    return this.resulthttpClient
      .get<ActiveUsersDTO[]>(`${USER_MANAGEMENT}/active-users`, true)
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

  getAvailableUsers(
    roleID: number
  ): Observable<ResponseResult<ActiveUsersDTO[]>> {
    return this.resulthttpClient
      .get<ActiveUsersDTO[]>(
        `${USER_MANAGEMENT}/${roleID}/available-users`,
        true
      )
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
  getUserByRole(roleID: number): Observable<ResponseResult<ActiveUsersDTO[]>> {
    return this.resulthttpClient
      .get<ActiveUsersDTO[]>(`${USER_MANAGEMENT}/${roleID}/user-roles`, true)
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

  searchUser(
    query: SearchUserQuery
  ): Observable<ResponseResult<Pagination<UserSearchPaginationDTO>>> {
    return this.resulthttpClient
      .getSearchWithPagination<User>(
        `${USER_MANAGEMENT}/paged?${this.httpClient.serialiazeQueryString(
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

  deleteUser(
    userAccountID: number
  ): Observable<ResponseResult<string>> {
    return this.resulthttpClient
      .delete<string>(`${USER_MANAGEMENT}/${userAccountID}`, userAccountID, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  searchByUserAccountID(
    userAccountID: number
  ): Observable<ResponseResult<UserSearchPaginationDTO[]>> {
    return this.resulthttpClient
      .get<User[]>(
        `${USER_MANAGEMENT}/${userAccountID} `,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorHandlingService.handleError(error);
          return throwError(() => error);
        })
      );
  }

  lockUser(lockUnlockUserDTO: LockUnlockUserDTO): Observable<ResponseResult<string>> {
    return this.resulthttpClient
      .post<string>(`${USER_MANAGEMENT}/lock`, lockUnlockUserDTO, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  exportUsers(exportUserDto: ExportUsersDTO): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${USER_MANAGEMENT}/download?${this.httpClient.serialiazeQueryString(exportUserDto)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
}
