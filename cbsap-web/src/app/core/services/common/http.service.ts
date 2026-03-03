import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ResultObject } from '../../model/common/resultObject-model';
import { LocalStorageService } from './local-storage.service';
import { Pagination } from '../../model/common/pagination';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient,
    private localStorage: LocalStorageService,
    ) {}

  private getDefaultHeaders(): HttpHeaders {
    // Add any default headers here
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
  private getAuthHeaders(): HttpHeaders {
   
    const authToken = this.localStorage.get('token');
    
    if (authToken) {
      return this.getDefaultHeaders().append('Authorization', `Bearer ${authToken}`);
    }

    return this.getDefaultHeaders();
  }

  // Generic GET Request

  get<T>(endpoint: string, withAuthorizeToken: boolean = true): Observable<ResultObject<T>> {
    const headers = withAuthorizeToken ? this.getAuthHeaders() : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get<ResultObject<T>>(url, {headers});
  }
  getSearchWithPagination<T>(endpoint: string, withAuthorizeToken: boolean = true): Observable<ResultObject<Pagination<T>>> {
    const headers = withAuthorizeToken ? this.getAuthHeaders() : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get<ResultObject<Pagination<T>>>(url, {headers});
  }
  // Post GET Request
  post<T>(endpoint: string, data: any, withAuthorizeToken: boolean = true): Observable<ResultObject<T>> {
    const headers = withAuthorizeToken ? this.getAuthHeaders() : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.post<ResultObject<T>>(url, data, { headers })
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleHttpError<T>(error))
    );;
  }
  // Put GET Request
  put<T>(endpoint: string, data: any, withAuthorizeToken: boolean = true): Observable<ResultObject<T>>{
    const headers = withAuthorizeToken ? this.getAuthHeaders() : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.put<ResultObject<T>>(url, data, {headers })
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleHttpError<T>(error))
    );
    ;
  }

  patch<T>(endpoint: string, data: any, withAuthorizeToken: boolean = true): Observable<ResultObject<T>> {
    const headers = withAuthorizeToken ? this.getAuthHeaders() : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.patch<ResultObject<T>>(url, data, {headers })
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleHttpError<T>(error))
    );;
  }
  delete<T>(endpoint: string, data: any, withAuthorizeToken: boolean = true): Observable<ResultObject<T>> {
    const headers = withAuthorizeToken ? this.getAuthHeaders() : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.patch<ResultObject<T>>(url, data, {headers})
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleHttpError<T>(error))
    );
  }

  private handleHttpError<T>(error: HttpErrorResponse): Observable<ResultObject<T>> {
    console.error('HTTP error occurred:', error);
    return throwError( () => new ResultObject<T>(false,  error.error || 'Server error'));
  }

  public serialiazeQueryString(obj: any): string {
    const str = [];
    for (const p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    return str.join('&');
  }
  
}
