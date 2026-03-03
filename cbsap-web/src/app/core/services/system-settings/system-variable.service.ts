import { Injectable } from '@angular/core';
import { ResponseResult } from '@core/model/common';
import { ArchiveInvSettingDto } from '@core/model/system-settings/archived-invoice/archive-invoice-setting.dto';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ResultsHttpService } from '../common/results-http.service';
import { SYSTEM_VARIABLES } from '@core/constants/system-settings/system-variable.constants';
import { HttpErrorResponse } from '@core/constants';

@Injectable({
  providedIn: 'root',
})
export class SystemVariableService {
  constructor(private resultHttpClient: ResultsHttpService) {}

  updateArchiveInvoiceSetting(
    archiveInvSetting: ArchiveInvSettingDto
  ): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .post<boolean>(`${SYSTEM_VARIABLES}`, archiveInvSetting, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getArchiveInvoiceSetting(): Observable<ResponseResult<ArchiveInvSettingDto>> {
    return this.resultHttpClient
      .get<ArchiveInvSettingDto>(SYSTEM_VARIABLES, true)
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
