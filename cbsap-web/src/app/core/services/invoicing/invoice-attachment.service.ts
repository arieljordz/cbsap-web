import { Injectable } from '@angular/core';
import { HttpErrorResponse, INV_ENPOINT } from '@core/constants';
import { ResponseResult } from '@core/model/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResultsHttpService } from '../common/results-http.service';
import {
  GetAllInvAttachmentDto,
  InvAttachmentDto,
  InvAttachmentFromDto,
} from '@core/model/invoicing/invoicing.index';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InvoiceAttachmentService {
  constructor(private resultHttpClient: ResultsHttpService) {}

  getUploadUrl(): string {
    const apiUrl = environment.apiUrl;
    return `${apiUrl}/${INV_ENPOINT.UPLOAD_ATTACHMENT}`;
  }

  upload(
    dto: InvAttachmentFromDto
  ): Observable<ResponseResult<InvAttachmentDto>> {
    const formData = new FormData();
    formData.append('File', dto.file);
    formData.append('InvoiceID', dto.invoiceID.toString());
    return this.resultHttpClient
      .postMultiForm<InvAttachmentDto>(`${INV_ENPOINT.UPLOAD_ATTACHMENT}`, formData, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  
  downloadAttachment(invoiceID: number): Observable<HttpResponse<Blob>> {
     return this.resultHttpClient
       .getFile(INV_ENPOINT.DOWNLOAD_ATTACHMENT(invoiceID),true)
       .pipe(
         map((response) => {
           return response;
         }),
         catchError((error: HttpErrorResponse) => {
           return throwError(() => error);
         })
       );
   }

    getAttachments(invoiceID:number): Observable<ResponseResult<InvAttachmentDto[]>> {
       return this.resultHttpClient.get<InvAttachmentDto[]>(`${INV_ENPOINT.GETALL_ATTACHMENT(invoiceID)}`, true).pipe(
         catchError((error: HttpErrorResponse) => {
           return throwError(() => error);
         })
       );
     }
  
  
}
