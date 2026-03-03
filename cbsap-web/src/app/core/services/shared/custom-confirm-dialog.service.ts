import { Injectable } from '@angular/core';
import { ConfirmOptions } from '@core/utils';
import {  ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CustomConfirmDialogService {

  constructor( private confirmationService: ConfirmationService) { }

  confirm(options: ConfirmOptions): void {
    this.confirmationService.confirm({
      message: options.message,
      header: options.header ?? 'Confirm',
      acceptLabel: options.acceptLabel ?? 'Yes',
      rejectLabel: options.rejectLabel ?? 'No',
      acceptButtonStyleClass: 'p-button-danger p-button-rounded',
      rejectButtonStyleClass: 'p-button-contrast p-button-rounded',
      accept: options.accept,
      reject: options.reject,
      closable:options.closable??true
    });
  }

  confirmUnsavedChanges(onAccept: () => void, onReject: () => void): void {
    this.confirm({
      message: 'You have unsaved changes. Are you sure you want to leave this page?',
      header: 'Discard Changes?',
      acceptLabel: 'Discard',
      rejectLabel: 'Stay on Page',
      accept: onAccept,
      reject : onReject
    });
  }


  confirmOverrideUnlock(onAccept: () => void, onReject: () => void): void {
    this.confirm({      
      message: 'The invoice is locked by someone else. Do you want to override and unlock it?',
      header: 'Record Locked',
      acceptLabel: 'No',
      rejectLabel: 'Yes',
      closable:false,
      accept: onAccept,
      reject : onReject
    });
  }
}
