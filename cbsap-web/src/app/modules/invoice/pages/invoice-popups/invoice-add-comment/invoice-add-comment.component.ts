import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import { CommonModule, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageSeverity } from '@core/constants';
import { ResponseResult, TableColumn } from '@core/model/common';
import {
  AddCommentFormGroup,
  createCommentForm,
  InvoiceCommentDto,
  LoadInvoiceCommentQuery,
  LoadInvoiceCommentsDto,
} from '@core/model/invoicing/invoicing.index';
import { AlertService, GridService, ValidationService } from '@core/services';
import { InvoiceDetailService } from '@core/services/invoicing/invoice-detail.service';
import { DynamicGridComponent } from '@shared/grid/dynamic-grid/dynamic-grid.component';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { QuickSearchComponent } from '@shared/quick-search/quick-search.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { Subject, takeUntil } from 'rxjs';
import { CharacterFocusTrackerDirective } from '@shared/directives/character-focus-tracker.directive';
import { CharacterLengthPipe } from '@shared/pipes/character-length.pipe';
import { getErrorMessage } from '@core/utils';

@Component({
  selector: 'app-invoice-add-comment',
  standalone: true,
  providers: [DialogService, AlertService, DynamicGridService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    PrimeImportsModule,
    ButtonModule,
    DynamicGridComponent,
    NgIf,
    CharacterFocusTrackerDirective,
    CharacterLengthPipe,
  ],
  templateUrl: './invoice-add-comment.component.html',
  styleUrl: './invoice-add-comment.component.scss',
})
export class InvoiceAddCommentComponent implements OnInit, OnDestroy {
  private destroySubject: Subject<void> = new Subject();

  invAddCommentForm!: AddCommentFormGroup;
  invoiceID: number = 0;

  columns: TableColumn[] = [];
  sizes: any;

  isShowComments: boolean = true;
  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  loading: boolean = true;
  visible: boolean = false;
  sortField?: string = '';
  sortOrder: number = 1;
  gridConfig: GridConfig<LoadInvoiceCommentsDto> | null = null;

  focusStates: { [key: string]: boolean } = {};
  /**
   *
   */
  constructor(
    private validationService: ValidationService,
    private invDetail: InvoiceDetailService,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private message: AlertService,
    private gridService: GridService,
    private dynamicGridService: DynamicGridService<LoadInvoiceCommentsDto>
  ) {
    this.invAddCommentForm = createCommentForm();
    this.invoiceID = (this.config.data?.invoiceID as number) ?? 0;
  }
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
  ngOnInit(): void {
    this.sizes = { name: 'Small', class: 'p-table?-sm' };
    this.initializeDynamicGrid();
    this.f['invoiceID'].setValue(this.invoiceID);
  }
  onSubmit() {
    const formValue: InvoiceCommentDto =
      this.invAddCommentForm.getRawValue() as InvoiceCommentDto;
    if (this.invAddCommentForm.valid) {
      this.addNewComment(formValue);
      this.f['comment'].setValue('');
      this.invAddCommentForm.markAsPristine();
      this.invAddCommentForm.markAsUntouched();
      this.f['comment'].updateValueAndValidity();
    }
  }
  addNewComment(formValue: InvoiceCommentDto) {
    this.invDetail.saveinvoiceComment(formValue).subscribe({
      next: (response) => {
        if (response.isSuccess) {
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Error on Adding Comment',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.loadData(1);
      },
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  get f() {
    return this.invAddCommentForm.controls;
  }

  /**Load Comments */
  private initializeDynamicGrid() {
    const columns = this.gridService.loadInvoiceCommentsColumn();
    this.dynamicGridService.setConfig({
      columns,
      data: [],
      totalRecords: 0,
      pageSize: 10,
      pageNumber: 1,
      sortField: '',
      sortOrder: -1,
      loading: false,
      rowClick: [
        {
          allow: false,
        },
      ],
    });
    if (this.isShowComments) this.loadData(1);
  }

  loadData(pageNumber: number) {
    this.isShowComments = true;
    const query: LoadInvoiceCommentQuery = {
      InvoiceID: this.invoiceID,
      PageNumber: pageNumber,
      PageSize: this.gridConfig?.pageSize ?? 10,
      SortField: this.gridConfig?.sortField ?? '',
      SortOrder: this.gridConfig?.sortOrder ?? -1,
    };

    this.dynamicGridService.setLoading(true);
    this.searchRejectedInvoice(query);
  }

  onLazyLoad(event: any): void {
    const pageNumber = event.pageNumber;
    const rows = event.pageSize ?? 10;
    const sortField = event.sortField || '';
    const sortOrder = event.sortOrder ?? -1;

    const query: LoadInvoiceCommentQuery = {
      InvoiceID: this.invoiceID,
      PageNumber: pageNumber,
      PageSize: rows,
      SortField: sortField,
      SortOrder: sortOrder,
    };
    this.dynamicGridService.setLoading(true);
    this.searchRejectedInvoice(query);
  }

  searchRejectedInvoice(query: LoadInvoiceCommentQuery) {
    query.InvoiceID = this.invoiceID || 0;

    this.invDetail
      .loadInvoiceComments(query)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.dynamicGridService.updateData(
              res.responseData?.data ?? [],
              res.responseData?.totalCount ?? 0,
              query.PageSize
            );

            this.totalRecords = res.responseData?.totalCount ?? 0;
          }
        },
        error: () => {
          this.dynamicGridService.setLoading(false);
        },
      });
  }

  onFocusChange(field: string, isFocused: boolean) {
    this.focusStates[field] = isFocused;
  }

  readonly getErrorMessage = (
    control: AbstractControl | null,
    fieldName: string
  ): string | null =>
    getErrorMessage(this.validationService, control, fieldName);
}
