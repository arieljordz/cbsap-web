import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';

import {
  LOGIN,
  PASSWORD_RESET,
  SETNEW_PASSWORD,
  ACTIVATE_USER,
  USER_THUMBNAIL,
  ISPASSWORDRESETLINKVALID,
  HttpErrorResponse,
  ISACTIVENEWUSERLINKVALID,
  SWITCHROLE,
} from 'src/app/core/constants/index';
import {
  AuthenticationResult,
  LoginRequest,
  SwitchRoleRequest,
} from '../../model/auth/loginRequest';
import { ResponseResult } from '../../model/common';
import { LocalStorageService, ResultsHttpService } from '../index';
import {
  ActivateUserCommand,
  ForgotPasswordCommand,
  GetThumbnailInfoQuery,
  PermissionValues,
  SetNewPasswordCommand,
} from '../../model/auth/auth.index';
import { AccessToken } from '@core/model/auth/access-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usernameSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  public username$: Observable<string | null> =
    this.usernameSubject.asObservable();

  constructor(
    private localStorage: LocalStorageService,
    private resulthttpClient: ResultsHttpService
  ) {}

  // function to login
  login(
    loginRequest: LoginRequest
  ): Observable<ResponseResult<AuthenticationResult>> {
    return this.resulthttpClient
      .post<AuthenticationResult>(`${LOGIN}`, loginRequest, false)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            if (response.responseData) {
              this.setUsername(response.responseData?.userName);
              const token = response.responseData?.token;
              this.localStorage.set('token', token);
              this.savePermissions(token);
            }
          }
          return response;
        }),

        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  

  userHasPermission(permissionValue: PermissionValues): boolean {
    const permissions = this.getUserPermissions();
     return permissions.some(p => p === permissionValue);
  }

  
  private savePermissions(token:string){
      const decodedToken = this.decodeToken(token) as AccessToken;
      const permissions: PermissionValues[] = Array.isArray(decodedToken.permission) ? decodedToken.permission : [decodedToken.permission];
      this.localStorage.set('user_permissions', permissions);
      this.localStorage.set('authorisation_limit', decodedToken.authorisationlimit);
      this.localStorage.set('sr', decodedToken.role);
  }

  
  getUserPermissions(): PermissionValues[] {
    return this.localStorage.get("user_permissions") as PermissionValues[];
  }

  get authorisationLimit(): number {
    const limit = this.localStorage.get("authorisation_limit") ?? 0;
    return limit;
  }


  switchRole(roleId:number): Observable<ResponseResult<AuthenticationResult>> {
    var switchRoleRequest:SwitchRoleRequest = {
      roleId:roleId
    };
    return this.resulthttpClient
      .post<AuthenticationResult>(`${SWITCHROLE}`, switchRoleRequest, true)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            if (response.responseData) {
              this.setUsername(response.responseData?.userName);
              const token = response.responseData?.token;
              this.localStorage.set('token', token);
              this.savePermissions(token);
            }
          }
          return response;
        }),

        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  logout() : void {
    const authKey = [
    'username',
    'sr',
    'token',
    'user_permissions',
    'authorisation_limit'
    ];

    const searchKey = [
    'archive-queue-search',
    'exception-queue-search',
    'myinvoice-search',
    'reject-queue-search',
    'keyword-search',
    'permission-search',
    'role-search',
    'entity-search',
    'routingflow-search',
    'supplier-search',
    'taxcode-search',
    'user-search'
    ];

    const gridKey = [
    'myinvoice-grid', 
    'archive-queue-grid', 
    'exception-queue-grid', 
    'reject-queue-grid',
    'keyword-grid', 
    'permission-grid', 
    'role-grid', 
    'entity-grid', 
    'routingflow-grid',
    'supplier-grid', 
    'taxcode-grid', 
    'user-grid'
    ];

    try{
      this.setUsername(null);
      
      for (const k of [...authKey, ...gridKey, ...searchKey]) {
        this.localStorage.remove(k);
      }
    }catch(err){
      console.error('Logout encountered an error while clearing storage:', err)
    }finally{
      (document.activeElement as HTMLElement)?.blur?.();
    }           
  }


  private setUsername(username: string | null): void {
    this.localStorage.set('username', username);
    this.usernameSubject.next(username);
  }

  forgotPasswordReset(
    forgotPassword: ForgotPasswordCommand
  ): Observable<ResponseResult<boolean>> {
    return this.resulthttpClient
      .post<boolean>(`${PASSWORD_RESET}`, forgotPassword, false)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  setNewPassword(
    setNewPassword: SetNewPasswordCommand
  ): Observable<ResponseResult<boolean>> {
    return this.resulthttpClient
      .post<boolean>(`${SETNEW_PASSWORD}`, setNewPassword, false)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  activateNewUser(
    activateNewUser: ActivateUserCommand
  ): Observable<ResponseResult<boolean>> {
    return this.resulthttpClient
      .post<boolean>(`${ACTIVATE_USER}`, activateNewUser, false)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  isPasswordResetLinkValid(token: string): Observable<ResponseResult<boolean>> {
    return this.resulthttpClient
      .get<boolean>(`${ISPASSWORDRESETLINKVALID}/?token=${token}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  isActivateNewUserLinkValid(token: string): Observable<ResponseResult<boolean>> {
    return this.resulthttpClient
      .get<boolean>(`${ISACTIVENEWUSERLINKVALID}/?token=${token}`, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  setUserThumbnail(
    query: GetThumbnailInfoQuery
  ): Observable<ResponseResult<string>> {
    return this.resulthttpClient
      .post<string>(`${USER_THUMBNAIL}`, query, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  private decodeToken(token: string): any {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }

    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }
    const payload = JSON.parse(decoded);
    if (payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
      payload.role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    }
    return payload;
  }

  private urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: { break; }
      case 2: { output += '=='; break; }
      case 3: { output += '='; break; }
      default: {
        throw new Error('Illegal base64url string!');
      }
    }
    return this.b64DecodeUnicode(output);
  }

  private b64DecodeUnicode(str: any) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c: any) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

}
