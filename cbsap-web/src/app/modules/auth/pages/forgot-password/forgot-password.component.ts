import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ForgotPasswordCommand } from 'src/app/core/model/auth/auth.index';
import { ResponseResult } from 'src/app/core/model/common';
import { AuthService } from 'src/app/core/services';
import { ValidationService } from 'src/app/core/services/shared/validation.service';
import { getErrorMessage } from 'src/app/core/utils';
import { LoaderService } from './../../../../core/services/shared/loader.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [
    InputText,
    RouterLink,
    ButtonModule,
    ReactiveFormsModule,
    MessageModule,
    NgIf,
    NgClass
  ],
})
export class ForgotPasswordComponent implements OnInit {
  isSubmitting: boolean = false;
  isShowMessage: boolean = false;
  havingError: boolean = false;
  message?: string | null;
  forgotPassForm!: FormGroup;
  focusStates: { [key: string]: boolean } = {};

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  sendPasswordEmailReset() {

    if (this.isSubmitting) return;
    this.isSubmitting = true;
    const forgotPasswordCommand: ForgotPasswordCommand = {
      ...this.forgotPassForm.value,
    };
    this.isShowMessage = false;
    this.havingError = false;
    
    this.loaderService.show();
    this.authService
      .forgotPasswordReset(forgotPasswordCommand)
      .pipe()
      .subscribe({
        next: (response) => {
          this.loaderService.hide();
          if (response.isSuccess) {
            this.message = response.messages?.[0];
            this.havingError = false;
            this.isShowMessage = true;
            this.forgotPassForm.reset();
            this.forgotPassForm.patchValue({ emailAddress: '' });
          }
        },
        error: (error: ResponseResult<boolean>) => {
          this.message = error.messages?.[0];
          this.havingError = true;
          this.isShowMessage = true;
          this.loaderService.hide();
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  initializeForm() {
    this.forgotPassForm = new FormGroup({
      emailAddress: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
    });
  }
  get f() {
    return this.forgotPassForm.controls;
  }

 

  onSubmit() {
    if (this.forgotPassForm.valid) {
      this.sendPasswordEmailReset();
    }
  }

   readonly getErrorMessage = (
      control: AbstractControl | null,
      fieldName: string
    ): string | null =>
      getErrorMessage(this.validationService, control, fieldName);
  
    onFocusChange(field: string, isFocused: boolean) {
      this.focusStates[field] = isFocused;
    }
}
