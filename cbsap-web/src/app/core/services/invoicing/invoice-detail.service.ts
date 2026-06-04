import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ArchiveInvoiceSearchDto,
  ExceptionInvoiceSearchDto,
  GetInvoiceStatusDto,
  InvInfoDropdownDto,
  InvInfoDto,
  InvMyInvoiceSearchDto,
  InvoiceDto,
  InvStatusChangeDto,
  RejectedInvoiceSearchDto,
} from '@core/model/invoicing/invoice/invoice-info.dto';
import { SelectItem } from 'primeng/api';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { ResultsHttpService } from '../common/results-http.service';
import { Pagination, ResponseResult } from '@core/model/common';
import { HttpErrorResponse, INV_ENPOINT } from '@core/constants/index';
import {
  ArchiveSearchQuery,
  ExceptionsSearchQuery,
  ExportArchiveInvoiceQuery,
  ExportExceptionInvoiceQuery,
  ExportMyInvoiceQuery,
  ExportRejectedInvoiceQuery,
  GetInvAllocLineQuery,
  InvActivityLogDto,
  InvoiceCommentDto,
  LoadInvoiceCommentQuery,
  LoadInvoiceCommentsDto,
  MyInvoiceSearchQuery,
  RejectedSearchQuery,
} from '@core/model/invoicing/invoicing.index';
import {
  InvAllocationLineDto,
  InvAllocEntryDto,
} from '@core/model/invoicing/invoice/invoice-allocation-lines.dto';
import { ExcelService } from '@core/services/util-services/excel.service';
import { InvValidationResponseDto } from '@core/model/invoicing/invoice-status-change/submit-validation-response.dto';
import { InvInfoRoutingLevelDto } from '@core/model/invoicing/invoice/invoice-routing-level.dto';
import { InvoiceQueue, InvoiceStatusEnum } from '@core/enums';

@Injectable({
  providedIn: 'root',
})
export class InvoiceDetailService {
  private invinfoDropdownData$?: Observable<{
    currencies: SelectItem[];
    paymentTerms: SelectItem[];
  }>;
  constructor(
    private httpClient: HttpClient,
    private resultHttpClient: ResultsHttpService,
    private excelService: ExcelService
  ) {}

  getDropdownOptions(): Observable<{
    currencies: SelectItem[];
    paymentTerms: SelectItem[];
  }> {
    if (!this.invinfoDropdownData$) {
      this.invinfoDropdownData$ = this.httpClient
        .get<InvInfoDropdownDto>('assets/entity-options.json')
        .pipe(
          map((data) => ({
            currencies: data.currencies,
            paymentTerms: data.paymentTerms,
          })),
          shareReplay(1)
        );
    }
    return this.invinfoDropdownData$;
  }

  getInvoiceByInvID(invoiceID: number): Observable<ResponseResult<InvInfoDto>> {
    return this.resultHttpClient
      .get<InvInfoDto>(INV_ENPOINT.GET_BY_INVID(invoiceID), true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getInvoiceAllocationByInvID(
    invoiceID: number
  ): Observable<ResponseResult<InvAllocEntryDto[]>> {
    return this.resultHttpClient
      .get<InvAllocEntryDto[]>(
        INV_ENPOINT.ALLOC_LINES(invoiceID),
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

   addAllocationLine(
    invoiceID: number,
    allocationLine:InvAllocEntryDto
  ): Observable<ResponseResult<number>> {
    return this.resultHttpClient
      .post<number>(
        INV_ENPOINT.ALLOC_LINES(invoiceID),allocationLine,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  updateAllocationLine(
    invoiceID: number,
    allocationLine:InvAllocEntryDto
  ): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .put<boolean>(
        INV_ENPOINT.ALLOC_LINES(invoiceID),allocationLine,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  deleteAllocationLine(
    invoiceID: number,
    allocLineID: number
  ): Observable<ResponseResult<boolean>> {
    const url = `${INV_ENPOINT.ALLOC_LINES(invoiceID)}/${allocLineID}`;
    return this.resultHttpClient
      .delete<boolean>(url, null, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  

  getInvoiceActivityLogByInvID(
    invoiceID: number
  ): Observable<ResponseResult<InvActivityLogDto[]>> {
    return this.resultHttpClient
      .get<InvActivityLogDto[]>(
        INV_ENPOINT.GET_INV_ACTIVITY_LOG(invoiceID),
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  
  getInvoiceStatus(
    invoiceID: number
  ): Observable<ResponseResult<GetInvoiceStatusDto>> {
    return this.resultHttpClient
      .get<GetInvoiceStatusDto>(INV_ENPOINT.GET_INV_STATUS(invoiceID), true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getNextInvoiceId(
    invoiceID: number,
    statusType?: InvoiceStatusEnum | null,
    queueType?: InvoiceQueue | null
  ): Observable<ResponseResult<number | null>> {
    const query: Record<string, number> = {};
    if (statusType !== undefined && statusType !== null) {
      query['statusType'] = statusType;
    }
    if (queueType !== undefined && queueType !== null) {
      query['queueType'] = queueType;
    }

    const baseUrl = INV_ENPOINT.GET_NEXT_INVOICE(invoiceID);
    const url =
      Object.keys(query).length > 0
        ? `${baseUrl}?${this.resultHttpClient.serialiazeQueryString(query)}`
        : baseUrl;

    return this.resultHttpClient
      .get<number | null>(url, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getPreviousInvoiceId(
    invoiceID: number,
    statusType?: InvoiceStatusEnum | null,
    queueType?: InvoiceQueue | null
  ): Observable<ResponseResult<number | null>> {
    const query: Record<string, number> = {};
    if (statusType !== undefined && statusType !== null) {
      query['statusType'] = statusType;
    }
    if (queueType !== undefined && queueType !== null) {
      query['queueType'] = queueType;
    }

    const baseUrl = INV_ENPOINT.GET_PREVIOUS_INVOICE(invoiceID);
    const url =
      Object.keys(query).length > 0
        ? `${baseUrl}?${this.resultHttpClient.serialiazeQueryString(query)}`
        : baseUrl;

    return this.resultHttpClient
      .get<number | null>(url, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  loadInvAllocationline(
    query: GetInvAllocLineQuery
  ): Observable<ResponseResult<Pagination<InvAllocationLineDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<InvAllocationLineDto>(
        `${
          INV_ENPOINT.GET_INV_ALLOCATION_QUERY
        }${this.resultHttpClient.serialiazeQueryString(query)}`,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  saveInvoice(invoice: InvoiceDto): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .put<boolean>(`${INV_ENPOINT.UPDATE_INVOICE}`, invoice, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  myInvoiceSearch(
    query: MyInvoiceSearchQuery
  ): Observable<ResponseResult<Pagination<InvMyInvoiceSearchDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<InvMyInvoiceSearchDto>(
        `${
          INV_ENPOINT.GET_INV_MYINVOICE_SEARCH
        }${this.resultHttpClient.serialiazeQueryString(query)}`,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  exportMyInvoices(
    exportMyInvoiceQuery: ExportMyInvoiceQuery
  ): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${
          INV_ENPOINT.EXPORT_TO_EXCEL
        }${this.resultHttpClient.serialiazeQueryString(exportMyInvoiceQuery)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  forApproval(
    invoice: InvoiceDto
  ): Observable<ResponseResult<InvValidationResponseDto>> {
    return this.resultHttpClient
      .put<InvValidationResponseDto>(
        `${INV_ENPOINT.FOR_APPROVAL}`,
        invoice,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  forReject(dto: InvStatusChangeDto): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .put<boolean>(INV_ENPOINT.FOR_REJECT, dto, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  reactivate(dto: InvStatusChangeDto): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .put<boolean>(INV_ENPOINT.FOR_REACTIVATE, dto, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  forceToSubmit(dto: InvStatusChangeDto): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .put<boolean>(INV_ENPOINT.FOR_FORCETOSUBMIT, dto, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  forHold(dto: InvStatusChangeDto): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .put<boolean>(`${INV_ENPOINT.FOR_HOLD}`, dto, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  routeToException(
    dto: InvStatusChangeDto
  ): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .put<boolean>(`${INV_ENPOINT.ROUTE_TO_EXCEPTION}`, dto, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  submitInvoice(
    invoice: InvoiceDto
  ): Observable<ResponseResult<InvValidationResponseDto>> {
    return this.resultHttpClient
      .post<InvValidationResponseDto>(
        `${INV_ENPOINT.SUBMIT_INVOICE}`,
        invoice,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
  validateInvoice(
    invoice: InvoiceDto
  ): Observable<ResponseResult<InvValidationResponseDto>> {
    return this.resultHttpClient
      .post<InvValidationResponseDto>(
        `${INV_ENPOINT.VALIDATE_INVOICE}`,
        invoice,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**Rejected Queue */

  rejectedQueueSearch(
    query: RejectedSearchQuery
  ): Observable<ResponseResult<Pagination<RejectedInvoiceSearchDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<RejectedInvoiceSearchDto>(
        `${
          INV_ENPOINT.GET_INV_REJECTED_SEARCH
        }${this.resultHttpClient.serialiazeQueryString(query)}`,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  exportRejectInvoice(
    exportRejectedQuery: ExportRejectedInvoiceQuery
  ): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${
          INV_ENPOINT.REJECT_EXPORT_TO_EXCEL
        }${this.resultHttpClient.serialiazeQueryString(exportRejectedQuery)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  /** Exception Queue */
  exceptionQueueSearch(
    query: ExceptionsSearchQuery
  ): Observable<ResponseResult<Pagination<ExceptionInvoiceSearchDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<ExceptionInvoiceSearchDto>(
        `${
          INV_ENPOINT.GET_INV_EXCEPTION_SEARCH
        }${this.resultHttpClient.serialiazeQueryString(query)}`,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  exportExceptionInvoice(
    exportExceptionQuery: ExportExceptionInvoiceQuery
  ): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${
          INV_ENPOINT.EXCEPTION_EXPORT_TO_EXCEL
        }${this.resultHttpClient.serialiazeQueryString(exportExceptionQuery)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  /** Archive Invoice */
  archiveQueueSearch(
    query: ArchiveSearchQuery
  ): Observable<ResponseResult<Pagination<ArchiveInvoiceSearchDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<ArchiveInvoiceSearchDto>(
        `${
          INV_ENPOINT.GET_INV_ARCHIVE_SEARCH
        }${this.resultHttpClient.serialiazeQueryString(query)}`,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  exportArchiveInvoice(
    exportArchiveQuery: ExportArchiveInvoiceQuery
  ): Observable<ResponseResult<Blob>> {
    return this.excelService
      .exportExcelReport(
        `${
          INV_ENPOINT.ARCHIVE_EXPORT_TO_EXCEL
        }${this.resultHttpClient.serialiazeQueryString(exportArchiveQuery)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
  /** Invoice Comments */

  loadInvoiceComments(
    query: LoadInvoiceCommentQuery
  ): Observable<ResponseResult<Pagination<LoadInvoiceCommentsDto>>> {
    return this.resultHttpClient
      .getSearchWithPagination<LoadInvoiceCommentsDto>(
        `${
          INV_ENPOINT.LOAD_INV_COMMENTS
        }${this.resultHttpClient.serialiazeQueryString(query)}`,
        true
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  saveinvoiceComment(
    comment: InvoiceCommentDto
  ): Observable<ResponseResult<boolean>> {
    return this.resultHttpClient
      .post<boolean>(`${INV_ENPOINT.ADD_COMMENTS}`, comment, true)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getInvoicePdf(invoiceId: number): Observable<Blob> {
    const url = INV_ENPOINT.GET_IMAGE(invoiceId); // returns endpoint string
    return this.resultHttpClient
      .getFile(url)
      .pipe(map((response: HttpResponse<Blob>) => response.body as Blob));
  }

  getInvoiceRoutingLevels(invoiceId: number,supplierInfoId:number | null, keywordId:number | null
  ): Observable<ResponseResult<InvInfoRoutingLevelDto[]>> {
    return this.resultHttpClient
      .get<InvInfoRoutingLevelDto[]>(
        INV_ENPOINT.GET_ROUTINGLEVEL(invoiceId,supplierInfoId,keywordId),
        true
      )
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
