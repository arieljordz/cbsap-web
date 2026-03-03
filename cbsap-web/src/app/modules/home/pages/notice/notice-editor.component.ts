import { MessageSeverity } from '../../../../core/constants/index';
import { ConfirmationService } from 'primeng/api';
import {
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateNotice,UpdateNotice } from 'src/app/core/model/dashboard/index';
import { DashboardService ,AlertService} from 'src/app/core/services';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-notice-editor',
    templateUrl: './notice-editor.component.html',
    styleUrls: ['./notice.component.scss'],
    providers: [AlertService, ConfirmationService],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, InputText, NgIf, Checkbox, Button]
})
export class NoticeEditorComponent implements OnInit, AfterViewInit {
  noticeForm!: FormGroup;
  formSubmitted: boolean = false;
  noticeId: number = 0;

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const notice = this.config.data?.notice as UpdateNotice;
    this.noticeId = notice?notice.noticeID:0;
    
    this.noticeForm = this.formBuilder.group(
      {
        heading: ['', [Validators.required]],
        message: ['', [Validators.required]],
        sendEmail: [false]
      }
    );

    this.noticeForm.patchValue(notice);
  }

  ngAfterViewInit() {
    //this.setFocus();
  }

  get heading() {
    return this.noticeForm.get('heading')!;
  }
  get message() {
    return this.noticeForm.get('message')!;
  }
  get sendEmail() {
    return this.noticeForm.get('sendEmail')!;
  }
  

  closeDialog(success:boolean) {
   this.dialogRef.close(success);
  }

  onSubmit(form: FormGroup) {

    this.formSubmitted = true;
    if (form.valid) {
      if (this.noticeId > 0){
        this.updateMessage();
      }
      else {
      this.createMessage();
      }
      
    }
  }


  createMessage() {   
    const createNotice: CreateNotice = {
      heading: this.heading.value,
      message: this.message.value,
      sendNotification: this.sendEmail.value      
    };
   

    this.dashboardService.createNotice(createNotice).subscribe((response) => {
      if (response.isSuccess) {
        this.alertService.showToast(
          MessageSeverity.success.toString(),
          'Create notice',
          'Message has been successfully created.'
        );
        this.closeDialog(true);
      }      

    });
  }    
   

  updateMessage() {
    const updateNotice: UpdateNotice = {
      noticeID:this.noticeId,
      heading: this.heading.value,
      message: this.message.value,
      sendNotification:this.sendEmail.value
    };

    
    this.dashboardService.updateNotice(updateNotice).subscribe((response) => {
      if (response.isSuccess) {
        this.alertService.showToast(
          MessageSeverity.success.toString(),
          'Edit notice',
          'Message has been successfully updated.'
        );
        this.closeDialog(true);
      }      

    });
   
  }
  
}
