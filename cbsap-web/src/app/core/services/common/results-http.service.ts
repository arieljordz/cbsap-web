import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseResult } from './../../model/common/responseResult';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { Pagination } from '../../model/common/pagination';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ResultsHttpService {
  private apiUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {}

  private getDefaultHeaders(): HttpHeaders {
    // Add any default headers here
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private getMultipartFormHeader(): HttpHeaders {
    return new HttpHeaders({});
  }
  private getAuthHeaders(): HttpHeaders {
    const authToken = this.localStorage.get('token');

    if (authToken) {
      return this.getDefaultHeaders().append(
        'Authorization',
        `Bearer ${authToken}`
      );
    }

    return this.getDefaultHeaders();
  }
  private getMultiFormAuthHeaders(): HttpHeaders {
    const authToken = this.localStorage.get('token');

    if (authToken) {
      return this.getMultipartFormHeader().append(
        'Authorization',
        `Bearer ${authToken}`
      );
    }

    return this.getMultipartFormHeader();
  }

  // Generic GET Request

  get<T>(
    endpoint: string,
    withAuthorizeToken: boolean = true
  ): Observable<ResponseResult<T>> {
    const headers = withAuthorizeToken
      ? this.getAuthHeaders()
      : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get<ResponseResult<T>>(url, { headers });
  }

  getFile(
    endpoint: string,
    withAuthorizeToken: boolean = true
  ): Observable<HttpResponse<Blob>> {
    const headers = withAuthorizeToken
      ? this.getAuthHeaders()
      : this.getDefaultHeaders();

    const url = `${this.apiUrl}/${endpoint}`;

    return this.http.get(url, {
      headers,
      observe: 'response',
      responseType: 'blob',
    });
  }
  getSearchWithPagination<T>(
    endpoint: string,
    withAuthorizeToken: boolean = true
  ): Observable<ResponseResult<Pagination<T>>> {
    const headers = withAuthorizeToken
      ? this.getAuthHeaders()
      : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get<ResponseResult<Pagination<T>>>(url, { headers });
  }
  // Post GET Request
  post<T>(
    endpoint: string,
    data: any,
    withAuthorizeToken: boolean = true
  ): Observable<ResponseResult<T>> {
    const headers = withAuthorizeToken
      ? this.getAuthHeaders()
      : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http
      .post<ResponseResult<T>>(url, data, { headers })
      .pipe(
        catchError((error: ResponseResult<any>) =>
          this.handleHttpError<T>(error)
        )
      );
  }
  // Post GET Request
  postMultiForm<T>(
    endpoint: string,
    data: any,
    withAuthorizeToken: boolean = true
  ): Observable<ResponseResult<T>> {
    const headers = withAuthorizeToken
      ? this.getMultiFormAuthHeaders()
      : this.getMultipartFormHeader();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http
      .post<ResponseResult<T>>(url, data, { headers })
      .pipe(
        catchError((error: ResponseResult<any>) =>
          this.handleHttpError<T>(error)
        )
      );
  }
  // Put GET Request
  put<T>(
    endpoint: string,
    data: any,
    withAuthorizeToken: boolean = true
  ): Observable<ResponseResult<T>> {
    const headers = withAuthorizeToken
      ? this.getAuthHeaders()
      : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http
      .put<ResponseResult<T>>(url, data, { headers })
      .pipe(
        catchError((error: ResponseResult<any>) =>
          this.handleHttpError<T>(error)
        )
      );
  }

  patch<T>(
    endpoint: string,
    data: any,
    withAuthorizeToken: boolean = true
  ): Observable<ResponseResult<T>> {
    const headers = withAuthorizeToken
      ? this.getAuthHeaders()
      : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http
      .patch<ResponseResult<T>>(url, data, { headers })
      .pipe(
        catchError((error: ResponseResult<any>) =>
          this.handleHttpError<T>(error)
        )
      );
  }

  delete<T>(
    endpoint: string,
    data?: any,
    withAuthorizeToken: boolean = true
  ): Observable<ResponseResult<T>> {
    const headers = withAuthorizeToken
      ? this.getAuthHeaders()
      : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;

    const options = {
      headers,
      body: data,
    };

    return this.http
      .delete<ResponseResult<T>>(url, options)
      .pipe(
        catchError((error: ResponseResult<any>) =>
          this.handleHttpError<T>(error)
        )
      );
  }

  downloadExcelfile(
    endpoint: string,
    withAuthorizeToken: boolean = true
  ): Observable<ResponseResult<Blob>> {
    const headers = withAuthorizeToken
      ? this.getAuthHeaders()
      : this.getDefaultHeaders();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get(url, { responseType: 'blob', headers }).pipe(
      map((blob: Blob) => ({
        statusCode: 400,
        isSuccess: true,
        message: 'File downloaded successfully',
        responseData: blob,
      })),
      catchError((error: ResponseResult<any>) => {
        return throwError(() => ({
          statusCode: 200,
          isSuccess: false,
          message: 'Failed to download Excel file',
          responseData: null,
        }));
      })
    );
  }

  private handleHttpError<T>(
    error: ResponseResult<any>
  ): Observable<ResponseResult<T>> {
    return throwError(
      () =>
        new ResponseResult<T>(
          error.statusCode,
          false,
          error.responseData,
          error.messages
        )
    );
  }

  // public serialiazeQueryString(obj: any): string {
  //   const str = [];
  //   for (const p in obj)
  //     if (obj.hasOwnProperty(p)) {
  //       str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
  //     }
  //   return str.join('&');
  // }

  public serialiazeQueryString(obj: any): string {
    const str: string[] = [];

    for (const key in obj) {
      if (
        !obj.hasOwnProperty(key) ||
        obj[key] === undefined ||
        obj[key] === null
      )
        continue;

      const value = obj[key];

      if (Array.isArray(value)) {
        value.forEach((val) => {
          str.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
        });
      } else {
        str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      }
    }

    return str.join('&');
  }
}
