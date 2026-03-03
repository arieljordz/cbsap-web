import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { ErrorHandlerService } from '../../services/index';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ResponseResult } from '../../model/common';

export const GlobalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandlerService = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessages: string[] = [];
      errorMessages = ['An unknown error occurred'];
      let statusCode = error.status || 500;

      let responseData: string = '';
      if (error.error instanceof ErrorEvent) {
        errorMessages = [`Client Error: ${error.error.message}`];
      } else {
        if (error.status >= 500) {
          errorHandlerService.handleError(error);
        }

        responseData = error.error.responseData ?? null;
        statusCode = error.error?.statusCode || error.status || 500;
        errorMessages = error.error?.messages || [
          error.message || 'Unexpected error',
        ];
      }
      return throwError(() =>
        ResponseResult.failure(statusCode, responseData, errorMessages)
      );
    })
  );
};
