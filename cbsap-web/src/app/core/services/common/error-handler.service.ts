import { Injectable, ErrorHandler, Injector  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '../../constants';
import { Observable, throwError } from 'rxjs';
import { ResultObject } from '../../model/common/resultObject-model';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(private router: Router) { }

  handleError<T>(error: any): Observable<ResultObject<T>> {
    console.error('An error occurred:', error);

    // You can add logic here to redirect to an error page
    this.router.navigate(['/error']);

    // Return a Result with isSuccess set to false and an error message
    return throwError(() => new ResultObject<T>(false, error, 'An unexpected error occurred.'));
  }
}
