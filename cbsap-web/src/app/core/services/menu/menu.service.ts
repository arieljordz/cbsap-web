import { effect, Injectable, signal, computed } from '@angular/core';
import { ResultsHttpService } from '../common/results-http.service';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import { ResponseResult } from '../../model/common';
import { MenuListDto } from '../../model/menu/MenuListDto';
import { MENU } from '../../constants/menu/menu-constants';
import { ErrorHandlerService } from '../common/error-handler.service';
import { HttpErrorResponse } from '../../constants/';
import { RoleDTO } from '../../model/roles-management';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private roleSubject = new BehaviorSubject<number | null>(null);
  currentRole$ = this.roleSubject.asObservable();
  private menuList = signal<any | null>(null);

  setRole(role?: number) {
    this.roleSubject.next(role!);
  }

  constructor(
    private resulthttpClient: ResultsHttpService,
    private errorHandlingService: ErrorHandlerService
  ) {
   
  }

  readonly model = computed<any[]>(() => {
    const menu = this.menuList();
    return menu?.items ?? [];
  });



  getMenu(roleID?: number) : Observable<ResponseResult<MenuListDto>> {
    return this.resulthttpClient
      .get<MenuListDto>(`${MENU}${roleID}`, true)
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
