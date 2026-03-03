import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { ResultsHttpService } from '../common/results-http.service';
import { catchError, Observable, throwError } from 'rxjs';
import { ResponseResult } from '../../model/common';
import { ErrorHandlerService } from '../common/error-handler.service';
import { HttpErrorResponse } from '../../constants/common/HttpErrorResponse';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor(
    private resultHttpClient: ResultsHttpService,
    private errorHandlingService: ErrorHandlerService,
    private datePipe : DatePipe
  ) {}

  exportToExcel(
    data: any[],
    mappingFunction: any,
    sheetName: string,
    fileName: string
  ): void {
    const formattedData = data.map((record) => {
      return mappingFunction(record);
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const columnWidths = formattedData.reduce((acc, record) => {
      Object.keys(record).forEach((key, index) => {
        const cellLength =
          (record[key] && record[key].toString().length) < 5
            ? key.length * 1.2
            : 25;
        acc[index] = Math.max(acc[index] || 0, cellLength);
      });
      return acc;
    }, []);
    if (columnWidths.length > 0) {
      // worksheet['!cols'] = columnWidths.map((width) => ({ width }));
      worksheet['!cols'] = columnWidths.map((width: any) => ({
        width: width * 1.2,
      }));
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  getCurrentRows(table: Table): any[] {
    if (!table) {
      return [];
    }
    const filteredValue = table.filteredValue;
    const value = table.value;

    if (!filteredValue && !value) {
      return [];
    }
    const data = filteredValue || value;
    const startIndex = table?.first !== undefined ? table?.first : 0;
    const endIndex = Math.min(startIndex! + (table.rows || 0), data.length);
    return data.slice(startIndex!, endIndex);
  }

  getAllRows(table: Table): any[] {
    if (!table) {
      return [];
    }
    const filteredValue = table.filteredValue;
    const value = table.value;

    if (!filteredValue && !value) {
      return [];
    }
    const data = filteredValue || value;
    return data;
  }

  excelFileName(fileName: string): string {
    const timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    return `${fileName}_${timestamp}.xlsx`;
  }

  exportExcelReport<T>(
    endpoint: string,
    query: T
  ): Observable<ResponseResult<Blob>> {
    return this.resultHttpClient
      .downloadExcelfile(
        `${endpoint}${this.resultHttpClient.serialiazeQueryString(query)}`,
        true
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorHandlingService.handleError(error);
          return throwError(() => error);
        })
      );
  }
  saveFile(blob: Blob, fileName: string) {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
}
