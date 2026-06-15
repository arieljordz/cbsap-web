import { NgClass, NgIf } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageSeverity } from '@core/constants';
import {
  InvoiceActionButton,
  InvoiceQueue,
  InvoiceStatusEnum,
} from '@core/enums';
import { Permission, PermissionValues } from '@core/model/auth/permission';
import { ResponseResult } from '@core/model/common';
import { InvAllocEntryDto } from '@core/model/invoicing/invoice/invoice-allocation-lines.dto';
import {
  AmountDto,
  InvInfoDto,
  InvValidationResponseDto,
  InvoiceDto,
} from '@core/model/invoicing/invoicing.index';
import {
  AlertService,
  AuthService,
  CustomConfirmDialogService,
  InvoiceDetailService,
  InvoiceFormService,
  LoaderService,
} from '@core/services';

import {
  InvoiceActionsComponent,
  InvoiceAddCommentComponent,
  InvoiceAttachmentComponent,
  InvoiceImageViewerComponent,
  InvoiceInfoComponent,
  InvoiceLinesComponent,
  InvoiceRoutingFlowComponent,
  InvoiceStatusChangeComponent,
  InvoiceValidationResponseComponent,
} from '@modules/invoice/pages/invoice-pages.index';

import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { InvoiceActivityLogComponent } from '../../invoice-popups/invoice-activity-log/invoice-activity-log.component';
import { PoMatchingComponent } from '../../purchase-order/po-matching/po-matching.component';
import { PoLinesSharedService } from '@core/services/purchase-order/po-lines-shared.service';
import { DynamicGridService } from '@core/services/shared/dynamic-grid.service';
import { LockingService } from '@core/services/locking/invoice-locking.service';
@Component({
  selector: 'app-invoice-main',
  standalone: true,
  providers: [
    DialogService,
    AlertService,
    CustomConfirmDialogService,
    DynamicGridService,
  ],
  imports: [
    PrimeImportsModule,
    FormsModule,
    ReactiveFormsModule,
    InvoiceImageViewerComponent,
    InvoiceInfoComponent,
    InvoiceLinesComponent,
    InvoiceRoutingFlowComponent,
    InvoiceActionsComponent,

    NgClass,
    NgIf,
  ],
  templateUrl: './invoice-main.component.html',
  styleUrl: './invoice-main.component.scss',
})
export class InvoiceMainComponent implements OnInit, OnDestroy, AfterViewInit {


  @ViewChild(InvoiceImageViewerComponent)
  imageViewerComp!: InvoiceImageViewerComponent;
  @ViewChild(InvoiceInfoComponent) invInvComp!: InvoiceInfoComponent;
  @ViewChild(InvoiceLinesComponent) invLinesComp!: InvoiceLinesComponent;
  @ViewChild('invroutingFlowComp')
  invroutingFlowComp!: InvoiceRoutingFlowComponent;
  
  invoiceID: number = 0;
  keywordID:number | null = 0;
  supplierInfoID:number | null = 0;

  invoiceTotalAmount: number = 0;
  authorisationLimit: number = this.authService.authorisationLimit;

  changeColor = 'p-button-contrast';
  status = 'Pending';
  private destroy$ = new Subject<void>();
  private isCancelInProgress = false;

  invoiceAllocationItems: InvAllocEntryDto[] = [];
  queueroute?: InvoiceQueue | null = null;
  invoiceStatus?: InvoiceStatusEnum | null = null;
  InvoiceActionButton = InvoiceActionButton;

  invValidationMessages: string[] = [];
  invoiceValidationHeader: string = '';

  invSubmissionMessages: string[] = [];
  invoiceSubmissionnHeader: string = '';

  invApproveMessages: string[] = [];
  invoiceApproveHeader: string = '';

  permissions: PermissionValues[] = [];
  isNextInvoiceLoading = false;
  isPreviousInvoiceLoading = false;
  hasNextInvoice: boolean | null = null;
  hasPreviousInvoice: boolean | null = null;

  private sub = new Subscription();
  private openCommentDialogSub = new Subscription();
  private openInvAttachmentDialogSub = new Subscription();

  private openInvoiceActivityLogDialogSub = new Subscription();
  private openPurchaseOrderDialogSub = new Subscription();
  private submitSub = new Subscription();
  private validateSub = new Subscription();
  private lockService = inject(LockingService);
  private hasLock:boolean = false;

  private invoiceInitialized = false;

  

  currentAmounts: AmountDto = {
    netAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
  };
  constructor(
    private dialogService: DialogService,
    private formService: InvoiceFormService,
    private invDetail: InvoiceDetailService,
    private message: AlertService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private customConfirmService: CustomConfirmDialogService,
    private loaderService: LoaderService,
    private authService: AuthService,
    private poLinesSharedService: PoLinesSharedService,
    private invFormService:InvoiceFormService
  ) {
    this.invoiceID = Number(this.activeRoute.snapshot.params['id'] ?? 0);
  }
  ngAfterViewInit(): void {

    this.lockService.onLockFailed((recordId, lockedBy) => {
       this.hasLock = false;
       this.customConfirmService.confirmOverrideUnlock(
        () => {
          this.isCancelInProgress = false;
          this.navigationBack();
        },
        () => {
          this.lockService.forceLockRecord(this.invoiceID,lockedBy);
        }
      );
    });

    

    this.lockService.onRecordLocked((recordId, lockedBy) => {
       this.customConfirmService.confirmOverrideUnlock(
        () => {
          this.isCancelInProgress = false;
          this.navigationBack();
          this.hasLock = false;
        },
        () => {
          this.lockService.forceLockRecord(this.invoiceID,lockedBy);
          this.hasLock = true;
        }
      );
    });

    this.lockService.connect();
    setTimeout(() => {
       this.lockService.lockRecord(this.invoiceID);
       this.hasLock = true;
    }, 2000);
  }

  ngOnInit(): void {
    this.listenToInvoiceChanges();
    this.initializeMain();
  }

  onTabSelect(event: any) {
  //routing flow tab 
   if (event==2){
    this.invroutingFlowComp.loadInvoiceRoutingFlow();
   }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.sub.unsubscribe();
    this.openCommentDialogSub.unsubscribe();
    this.openInvAttachmentDialogSub.unsubscribe();
    this.submitSub.unsubscribe();
    this.validateSub.unsubscribe();
    this.openInvoiceActivityLogDialogSub.unsubscribe();
    this.openPurchaseOrderDialogSub.unsubscribe();

    this.loaderService.hide();
    if (this.hasLock){
      this.lockService.unlockRecord(this.invoiceID);
    }
  }

  /** INVOICE ACTION */
  handleSave() {
    const invoiceForm = this.invInvComp.invInfoForm.getRawValue();
    const allocForm = this.invLinesComp.invoiceAllocationItems;

    const invoiceRoutingFlowForm =
      this.invroutingFlowComp.invInfoRoutingLevelForm.getRawValue();

    const invoicePayload = {
      ...invoiceForm,
      invoiceAllocationLines: allocForm,
      invInfoRoutingLevels: invoiceRoutingFlowForm.invInfoRoutingLevels,
    } as InvoiceDto;

    if (this.invInvComp.invInfoForm.valid) {
      this.invoiceTotalAmount = invoiceForm.totalAmount!;
      this.saveInvoiceForm(invoicePayload);
      this.invInvComp.invInfoForm.markAsPristine();
      this.invInvComp.invInfoForm.markAsUntouched();
      this.invInvComp.invInfoForm.updateValueAndValidity();
    }
  }

  reloadPermissions() {
    this.permissions = this.authService.getUserPermissions();
    const canApprove = this.canApproveInvoice;

    //approve and submit will display one at a time;if the user can approve invoice, then submit button should be hidden
    if (canApprove) {
      this.permissions = this.permissions.filter(
        (p) => p !== Permission.CanSubmitInvoice
      );
    } else {
      if (!this.permissions.includes(Permission.CanSubmitInvoice)) {
        this.permissions.push(Permission.CanSubmitInvoice);
      }
    }
  }

  get canApproveInvoice() {
    const canApprove =
      this.queueroute === InvoiceQueue.MyInvoices &&
      this.authService.userHasPermission(
        Permission.CanApproveInvoiceTotalAmount
      ) &&
      this.invoiceTotalAmount <= this.authorisationLimit;

    return canApprove;
  }

  invoiceDataLoaded(invoice: InvInfoDto) {
    this.invoiceTotalAmount = invoice.totalAmount;
    this.invoiceStatus = invoice.statusType ?? this.invoiceStatus;
    this.queueroute = invoice.queueType ?? this.queueroute;
    this.keywordID = invoice.keywordID;
    this.supplierInfoID = invoice.supplierInfoID;
    this.getInvoiceStatus();
    this.reloadPermissions();
  }

  onApprove() {
    const invoiceForm = this.invInvComp.invInfoForm.getRawValue();
    const allocForm = this.invLinesComp.invoiceAllocationItems;
    const invoicePayload = {
      ...invoiceForm,
      invoiceAllocationLines: allocForm,
    } as InvoiceDto;

    if (!this.invInvComp.invInfoForm.valid) {
      this.invInvComp.invInfoForm.markAllAsTouched();
    }
    if (this.invInvComp.invInfoForm.valid) {
      this.approveInvoiceFom(invoicePayload);
    }
  }

  onReject() {
    this.invDetail.getInvoiceStatus(this.invoiceID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          const ref = this.dialogService.open(InvoiceStatusChangeComponent, {
            header: 'Reject invoice',
            modal: true,
            closable: true,
            width: '800px',
            data: {
              invoiceID: this.invoiceID,
              queue: response.responseData?.queue,
              action: InvoiceActionButton.Reject,
            },
            style: { minHeight: '200px' },
            baseZIndex: 1200,
          });

          ref.onClose.subscribe((result) => {
            if (result) {
              this.getInvoiceStatus();
              this.navigationBack();
            }
          });
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Invoice Rejection',
          error.messages?.[0],
          2000
        );
      },
    });
  }

  onRouteToException() {
    this.invDetail.getInvoiceStatus(this.invoiceID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          const ref = this.dialogService.open(InvoiceStatusChangeComponent, {
            header: 'Route to Exception',
            modal: true,
            closable: true,
            width: '800px',
            data: {
              invoiceID: this.invoiceID,
              queue: response.responseData?.queue,
              action: InvoiceActionButton.RouteToException,
            },
            style: { minHeight: '200px' },
            baseZIndex: 1200,
          });

          ref.onClose.subscribe((result) => {
            if (result) {
              this.getInvoiceStatus();
              this.navigationBack();
            }
          });
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Route To Exception',
          error.messages?.[0],
          2000
        );
      },
    });
  }

  onReactivate() {
    this.invDetail.getInvoiceStatus(this.invoiceID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          const ref = this.dialogService.open(InvoiceStatusChangeComponent, {
            header: 'Reactivate invoice',
            modal: true,
            closable: true,
            width: '800px',
            data: {
              invoiceID: this.invoiceID,
              queue: response.responseData?.queue,
              action: InvoiceActionButton.Reactivate,
            },
            style: { minHeight: '200px' },
            baseZIndex: 1200,
          });

          ref.onClose.subscribe((result) => {
            if (result) {
              this.getInvoiceStatus();
              this.navigationBack();
            }
          });
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Invoice Reactivation',
          error.messages?.[0],
          2000
        );
      },
    });
  }

  onHold() {
    this.invDetail.getInvoiceStatus(this.invoiceID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          const ref = this.dialogService.open(InvoiceStatusChangeComponent, {
            header: 'Hold invoice',
            modal: true,
            closable: true,
            width: '800px',
            data: {
              invoiceID: this.invoiceID,
              queue: response.responseData?.queue,
              action: InvoiceActionButton.Hold,
            },
            style: { minHeight: '200px' },
            baseZIndex: 1200,
          });

          ref.onClose.subscribe((result) => {
            if (result) {
              this.getInvoiceStatus();
              this.navigationBack();
            }
          });
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Invoice Hold ',
          error.messages?.[0],
          2000
        );
      },
    });
  }

  handleCancel() {
    const isAlreadyProcess = [
      InvoiceStatusEnum.ReadyForExport,
      InvoiceStatusEnum.Archived,
      InvoiceStatusEnum.Exported,
    ].includes(this.invoiceStatus!);

    if (isAlreadyProcess) {
      this.navigationBack();
      return;
    }
    if (this.isCancelInProgress) return;
    this.isCancelInProgress = true;

    const touched =
      (this.invInvComp?.invInfoForm?.touched ||
        this.invroutingFlowComp?.invInfoRoutingLevelForm.touched) ??
      false;
    if (touched) {
      this.customConfirmService.confirmUnsavedChanges(
        () => {
          this.isCancelInProgress = false;
          this.navigationBack();
        },
        () => {
          this.isCancelInProgress = false;
        }
      );
    } else {
      this.navigationBack();
      this.isCancelInProgress = false;
    }
  }

  handleSubmit() {
    const invoiceForm = this.invInvComp.invInfoForm.getRawValue();
    const allocForm = this.invLinesComp.invoiceAllocationItems;
    const invoicePayload = {
      ...invoiceForm,
      invoiceAllocationLines: allocForm,
    } as InvoiceDto;

    if (!this.invInvComp.invInfoForm.valid) {
      this.invInvComp.invInfoForm.markAllAsTouched();
    }

    if (this.invInvComp.invInfoForm.valid) {
      this.submitInvoiceForm(invoicePayload);
    }
  }

  handleValidate() {
    const invoiceForm = this.invInvComp.invInfoForm.getRawValue();
    const allocForm = this.invLinesComp.invoiceAllocationItems;
    const invoicePayload = {
      ...invoiceForm,
      invoiceAllocationLines: allocForm,
    } as InvoiceDto;

    if (!this.invInvComp.invInfoForm.valid) {
      this.invInvComp.invInfoForm.markAllAsTouched();
    }
    if (this.invInvComp.invInfoForm.valid) {
      this.validateInvoiceForm(invoicePayload);
    }
  }

  /** FUNCTION AND  METHODS */
  private initializeMain() {
    this.sub = this.formService.save$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.handleSave());

    this.formService.cancel$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.handleCancel());

    this.openCommentDialogSub =
      this.formService.openInvoiceCommentDialog$.subscribe(() => {
        this.AddNewComment();
      });
    this.openInvAttachmentDialogSub =
      this.formService.openInvAttachmentDialog$.subscribe(() => {
        this.AddAttachment();
      });
    this.openInvoiceActivityLogDialogSub =
      this.formService.openInvActivityLog$.subscribe(() => {
        this.OpenInvoiceActivityLog();
      });

    this.openPurchaseOrderDialogSub =
      this.formService.openPurchaseOrder$.subscribe(() => {
        this.OpenPurchaseOrder();
      });

    this.submitSub = this.formService.submit$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.handleSubmit());

    this.validateSub = this.formService.validate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.handleValidate());
  }

  private listenToInvoiceChanges(): void {
    this.activeRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const paramId = Number(params.get('id') ?? this.invoiceID ?? 0);
        if (Number.isNaN(paramId)) {
          return;
        }

        const shouldHandleChange =
          !this.invoiceInitialized || paramId !== this.invoiceID;
        this.invoiceID = paramId;

        if (shouldHandleChange) {
          this.handleInvoiceContextChange();
        }
      });
  }

  private handleInvoiceContextChange(): void {
    this.invoiceInitialized = true;
    this.hasNextInvoice = null;
    this.hasPreviousInvoice = null;
    this.isNextInvoiceLoading = false;
    this.isPreviousInvoiceLoading = false;
    this.invoiceStatus = null;
    this.queueroute = null;
    this.invoiceAllocationItems = [];
    this.currentAmounts = { netAmount: 0, taxAmount: 0, totalAmount: 0 };
    this.getInvoiceStatus();
  }

  private navigationBack() {
    const returnUrl = history.state.returnUrl || '/home';
    setTimeout(() => {
      this.router.navigateByUrl(returnUrl);
    }, 1000);
  }

  getInvoiceStatus() {
    this.invDetail
      .getInvoiceStatus(this.invoiceID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            const statusInfo = this.getStatusLabel(
              response.responseData?.status
            );
            this.changeColor = statusInfo.changeColor;
            this.status = statusInfo.label;
            this.queueroute = response.responseData?.queue;
            this.invoiceStatus = response.responseData?.status;

          }
        },
        error: (error: ResponseResult<boolean>) => {
          this.message.showToast(
            MessageSeverity.error.toString(),
            'Invoice Status ',
            error.messages?.[0],
            2000
          );
        },
        complete: () => {
          //  this.closeDialog();
        },
      });
  }

  getStatusLabel(value: number | null | undefined): {
    label: string;
    changeColor: string;
  } {
    if (
      value === null ||
      value === undefined ||
      InvoiceStatusEnum[value] === undefined
    ) {
      return {
        label: '',
        changeColor: '',
      };
    }

    const raw = InvoiceStatusEnum[value] ?? '';
    const label = raw.replace(/([a-z])([A-Z])/g, '$1 $2');

    let changeColor = '';
    switch (value) {
      case InvoiceStatusEnum.Approved:
        changeColor = 'p-button-success';
        break;
      case InvoiceStatusEnum.Rejected:
        changeColor = 'p-button-danger';
        break;
      case InvoiceStatusEnum.ApprovalOnHold:
      case InvoiceStatusEnum.ExceptionOnHold:
        changeColor = 'p-button-warn';
        break;
      default:
        changeColor = 'p-button-contrast';
    }
    return { label, changeColor };
  }
  private validateInvoiceForm(invoiceForm: InvoiceDto) {
    this.loaderService.show();
    this.invDetail.validateInvoice(invoiceForm).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          const validateResponse = response.responseData!;
          const { validationMessage, validationHeader } =
            this.extractValidationDetails(validateResponse, response.messages!);
          this.invValidationMessages = validationMessage;
          this.invoiceValidationHeader = validationHeader;
          this.loaderService.hide();
        }
      },
      error: (error: ResponseResult<InvValidationResponseDto>) => {
        const validateResponse = error.responseData!;
        const { validationMessage, validationHeader } =
          this.extractValidationDetails(validateResponse);
        this.invValidationMessages = validationMessage;
        this.invoiceValidationHeader = validationHeader;
        this.invoiceValidationHeader = validationHeader;
        this.invValidationMessages = validationMessage;
        this.loaderService.hide();
      },
      complete: () => {},
    });
  }

  private approveInvoiceFom(invoiceForm: InvoiceDto) {
    this.invDetail.forApproval(invoiceForm).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          const submitresponse = response.responseData!;

          const { validationMessage, validationHeader } =
            this.extractValidationDetails(submitresponse, response.messages!);
          this.invSubmissionMessages = validationMessage;
          this.invoiceSubmissionnHeader = validationHeader;

          this.OpenInvoiceValidation(
            this.invSubmissionMessages,
            'Approve Action',
            validationHeader
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Approve',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {
        this.getInvoiceStatus();
      },
    });
  }

  private saveInvoiceForm(invoiceForm: InvoiceDto) {
    this.invDetail.saveInvoice(invoiceForm).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.invoiceTotalAmount = invoiceForm.totalAmount;
          this.keywordID = invoiceForm.keywordID;
          this.supplierInfoID = invoiceForm.supplierInfoID;
          this.reloadPermissions();
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Invoice Update',
            'Invoice successfully saved',
            2000
          );
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.message.showToast(
          MessageSeverity.error.toString(),
          'Invoice Update',
          error.messages?.[0],
          2000
        );
      },
      complete: () => {},
    });
  }

  private submitInvoiceForm(invoiceForm: InvoiceDto) {
    this.loaderService.show();
    this.invDetail.submitInvoice(invoiceForm).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.message.showToast(
            MessageSeverity.success.toString(),
            'Submit',
            response.messages?.[0],
            2000
          );
          this.navigationBack();
        }
      },
      error: (error: ResponseResult<InvValidationResponseDto>) => {
        const validateResponse = error.responseData!;
        const { validationMessage, validationHeader } =
          this.extractValidationDetails(validateResponse);
        this.invSubmissionMessages = validationMessage;
        this.invoiceSubmissionnHeader = validationHeader;

        this.OpenInvoiceValidation(
          this.invSubmissionMessages,
          'Submit Action',
          validationHeader
        );
        this.loaderService.hide();
      },
      complete: () => {},
    });
  }

  private extractValidationDetails(
    response: InvValidationResponseDto,
    message?: string[]
  ): {
    validationMessage: string[];
    validationHeader: InvoiceActionButton;
  } {
    const raw = response?.failureMessages || '';
    const header =
      response!.invoiceActionType.toString() as InvoiceActionButton;

    if (raw) {
      let filteredMessages = raw
        .split(';')
        .map((m) => m.trim())
        .filter(
          (m) =>
            m.length > 0 &&
            (response?.queueType !== InvoiceQueue.ExceptionQueue ||
              !m.toLowerCase().includes('potential duplicate'))
        );
      filteredMessages = filteredMessages.length > 0 ? filteredMessages : [raw];

      return {
        validationMessage: filteredMessages,
        validationHeader: header,
      };
    }
    return {
      validationMessage: message!,
      validationHeader: header,
    };
  }

  isVisibleFor(button: InvoiceActionButton): boolean {
    if (!this.queueroute) return false;

    switch (button) {
      case InvoiceActionButton.Approve:
        return this.canApproveInvoice;

      case InvoiceActionButton.Hold:
        return [InvoiceQueue.MyInvoices, InvoiceQueue.ExceptionQueue].includes(
          this.queueroute
        );

      case InvoiceActionButton.Reject:
        return this.queueroute === InvoiceQueue.ExceptionQueue;

      case InvoiceActionButton.RouteToException:
        return this.queueroute === InvoiceQueue.MyInvoices;

      case InvoiceActionButton.Reactivate:
        return this.queueroute === InvoiceQueue.RejectionQueue;

      default:
        return false;
    }
  }

  /** POP UP */
  AddNewComment() {
    const ref = this.dialogService.open(InvoiceAddCommentComponent, {
      header: 'Add Comment ',
      modal: true,
      closable: true,
      width: '800px',

      data: { invoiceID: this.invoiceID },
      style: { minHeight: '200px' },
      dismissableMask: true,
      baseZIndex: 1200,
    });
  }
  AddAttachment() {
    const ref = this.dialogService.open(InvoiceAttachmentComponent, {
      header: 'Add Attachment',
      modal: true,
      closable: true,
      width: '800px',

      data: { invoiceID: this.invoiceID },
      style: { minHeight: '200px' },
      dismissableMask: true,
      baseZIndex: 1200,
    });
  }
  OpenInvoiceActivityLog() {
    const ref = this.dialogService.open(InvoiceActivityLogComponent, {
      header: 'Invoice Activity Log',
      modal: true,
      closable: true,
      width: '800px',

      data: { invoiceID: this.invoiceID },
      style: { minHeight: '200px' },
      dismissableMask: true,
      baseZIndex: 1200,
    });
  }

  OpenPurchaseOrder() {
    const invoiceForm = this.invInvComp.invInfoForm.getRawValue();
    this.poLinesSharedService.setSharedInvDataToSearchPO({
      suppName: invoiceForm.suppName,
      suppABN: invoiceForm.suppABN,
      poNo: invoiceForm.poNo,
    });
    const ref = this.dialogService.open(PoMatchingComponent, {
      header: 'Purchase Order Matching',
      modal: true,
      closable: true,
      maximizable: true,

      draggable: true,
      data: { invoiceNo: invoiceForm.invoiceNo, invoiceID: this.invoiceID },
      style: { minHeight: '200px' },
      dismissableMask: true,
      baseZIndex: 1200,
    });

    ref.onClose.subscribe(()=>{
      this.invFormService.triggerClosePODialog();
    });

    this.dialogService.getInstance(ref).maximize();
  }

  OpenInvoiceValidation(messages: string[], title: string, action: string) {
    const ref = this.dialogService.open(InvoiceValidationResponseComponent, {
      header: title,
      modal: true,
      closable: true,
      width: '800px',
      data: { messages: messages, action: action, invoiceID: this.invoiceID },
      style: { minHeight: '200px' },
      dismissableMask: false,
      draggable: false,
      baseZIndex: 1200,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        if (title === 'Submit Action') {
          this.navigationBack();
        } else {
          this.getInvoiceStatus();
        }
      }
    });
  }

  onItemsChange(updatedItems: InvAllocEntryDto[]) {
    this.invoiceAllocationItems = updatedItems;
  }
  handleAmountsChange(newAmounts: AmountDto) {
    this.currentAmounts = newAmounts;
  }

  loadPrevious(): void {
    if (this.isPreviousInvoiceLoading) {
      return;
    }

    this.isPreviousInvoiceLoading = true;
    const statusType = this.invoiceStatus ?? null;
    const queueType = this.queueroute ?? null;
    this.invDetail
      .getPreviousInvoiceId(this.invoiceID, statusType, queueType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isPreviousInvoiceLoading = false;

          if (!response?.isSuccess) {
            this.hasPreviousInvoice = false;
            this.message.showToast(
              MessageSeverity.error.toString(),
              'Previous Invoice',
              response?.messages?.[0] ??
                'Unable to load the previous invoice.',
              3000
            );
            return;
          }

          const previousId = response.responseData;
          const hasTarget = previousId !== null && previousId !== undefined;
          this.hasPreviousInvoice = hasTarget;

          if (hasTarget) {
            this.navigateToInvoice(previousId as number);
            return;
          }

          this.showNoInvoiceToast('Previous');
        },
        error: (error: ResponseResult<number | null>) => {
          this.isPreviousInvoiceLoading = false;
          this.hasPreviousInvoice = false;
          this.message.showToast(
            MessageSeverity.error.toString(),
            'Previous Invoice',
            error?.messages?.[0] ?? 'Unable to load the previous invoice.',
            3000
          );
        },
      });
  }

  loadNext(): void {
    if (this.isNextInvoiceLoading) {
      return;
    }

    this.isNextInvoiceLoading = true;
    const statusType = this.invoiceStatus ?? null;
    const queueType = this.queueroute ?? null;
    this.invDetail
      .getNextInvoiceId(this.invoiceID, statusType, queueType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isNextInvoiceLoading = false;

          if (!response?.isSuccess) {
            this.hasNextInvoice = false;
            this.message.showToast(
              MessageSeverity.error.toString(),
              'Next Invoice',
              response?.messages?.[0] ?? 'Unable to load the next invoice.',
              3000
            );
            return;
          }

          const nextId = response.responseData;
          const hasTarget = nextId !== null && nextId !== undefined;
          this.hasNextInvoice = hasTarget;

          if (hasTarget) {
            this.navigateToInvoice(nextId as number);
            return;
          }

          this.showNoInvoiceToast('Next');
        },
        error: (error: ResponseResult<number | null>) => {
          this.isNextInvoiceLoading = false;
          this.hasNextInvoice = false;
          this.message.showToast(
            MessageSeverity.error.toString(),
            'Next Invoice',
            error?.messages?.[0] ?? 'Unable to load the next invoice.',
            3000
          );
        },
      });
  }

  private navigateToInvoice(invoiceId: number): void {
    this.router.navigate(['/invoices', invoiceId, 'edit'], {
      queryParamsHandling: 'preserve',
    });
  }

  private showNoInvoiceToast(direction: 'Next' | 'Previous'): void {
    const directionLabel = `${direction} Invoice`;
    this.message.showToast(
      MessageSeverity.info.toString(),
      directionLabel,
      `No ${direction.toLowerCase()} invoice for this status/queue.`,
      3000
    );
  }
}
