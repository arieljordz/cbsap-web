import { trigger } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceFormService {
  private saveSubject = new Subject<void>();
  save$ = this.saveSubject.asObservable();

  private cancelSubject = new Subject<void>();
  cancel$ = this.cancelSubject.asObservable();

  private submitSubject = new Subject<void>();
  submit$ = this.submitSubject.asObservable();

  private validateSubject = new Subject<void>();
  validate$ = this.validateSubject.asObservable();

  private openAddCommentDialogSubject = new Subject<void>();
  openInvoiceCommentDialog$ = this.openAddCommentDialogSubject.asObservable();

  private openInvAttachmentDialogSubject = new Subject<void>();
  openInvAttachmentDialog$ = this.openInvAttachmentDialogSubject.asObservable();

  private openInvActivityLogSubject = new Subject<void>();
  openInvActivityLog$ = this.openInvActivityLogSubject.asObservable();

  private openPurchaseOrderSubject = new Subject<void>();
  openPurchaseOrder$ = this.openPurchaseOrderSubject.asObservable();

  private poDialogCloseSubject = new Subject<void>();
  closePODialog$ = this.poDialogCloseSubject.asObservable();

  constructor() {}

  triggerSave() {
    this.saveSubject.next();
  }
  triggerCancel() {
    this.cancelSubject.next();
  }
  triggerSubmit() {
    this.submitSubject.next();
  }
  triggerValidate() {
    this.validateSubject.next();
  }
  triggerOpenAddCommentDialog() {
    this.openAddCommentDialogSubject.next();
  }
  triggerOpenInvAttachmentDialog() {
    this.openInvAttachmentDialogSubject.next();
  }
  triggerOpenInvActivityLogDialog() {
    this.openInvActivityLogSubject.next();
  }

  triggerOpenPurchaseOrder() {
    this.openPurchaseOrderSubject.next();
  }

  triggerClosePODialog() {
    this.poDialogCloseSubject.next();
  }
}
