import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ENTITYPROFILE, HttpErrorResponse } from '../../constants/index';
import { EntityRoleDto, GetAllEntityDto } from '../../model/entity-profile/index';
import { ErrorHandlerService, ResultsHttpService } from '../index';
import { ResponseResult } from './../../model/common/index';
@Injectable({
  providedIn: 'root',
})
export class EntityProfileService {
  constructor(
    private httpClient: ResultsHttpService,
    private errorHandlingService: ErrorHandlerService
  ) {}

  getAllEntityProfiles(): Observable<ResponseResult<GetAllEntityDto[]>> {
    return this.httpClient
      .get<GetAllEntityDto[]>(`${ENTITYPROFILE}`, true)
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
  getAllAvailableEntity(
    roleID: number
  ): Observable<ResponseResult<GetAllEntityDto[]>> {
    return this.httpClient
      .get<GetAllEntityDto[]>(`${ENTITYPROFILE}/${roleID}`, true)
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

  getEntityProfileByRole(
    roleID: number
  ): Observable<ResponseResult<EntityRoleDto[]>> {
    return this.httpClient
      .get<EntityRoleDto[]>(`${ENTITYPROFILE}/${roleID}/entity`, true)
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
  getAvailableEntityProfile(
    roleID: number
  ): Observable<ResponseResult<GetAllEntityDto[]>> {
    return this.httpClient
      .get<GetAllEntityDto[]>(`${ENTITYPROFILE}/${roleID}/available-entities`, true)
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
}
