import { NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormControlOptions,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { finalize } from 'rxjs';
import { SetNewPasswordCommand } from 'src/app/core/model/auth/auth.index';
import { ResponseResult } from 'src/app/core/model/common';
import {
  LoaderService,
  AuthService,
  ValidationService,
} from 'src/app/core/services/index';
import {
  passwordValidator,
  MatchValidator,
  getErrorMessage,
} from 'src/app/core/utils';

@Component({
  selector: 'app-set-new-password',
  standalone: true,
  imports: [
    PasswordModule,
    ReactiveFormsModule,
    MessageModule,
    NgIf,
    ButtonModule,
  ],
  templateUrl: './set-new-password.component.html',
  styleUrl: './set-new-password.component.scss',
})
export class SetNewPasswordComponent implements OnInit {
  setNewPasswordForm!: FormGroup;
  isSubmitting: boolean = false;
  isShowMessage: boolean = false;
  havingError: boolean = false;
  message?: string | null;
  passwordRecoveryToken: string = '';
  isTokenValidated: boolean = false;

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private validationService: ValidationService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.passwordRecoveryToken = this.activeRoute.snapshot.params['prt'];
  }

  ngOnInit(): void {
    this.verfiyTokenValidity();
  }

  verfiyTokenValidity() {
    this.loaderService.show();
    this.authService
      .isPasswordResetLinkValid(this.passwordRecoveryToken)
      .pipe(
        finalize(() => {
          this.loaderService.hide(); 
          this.isTokenValidated = true;
        })
      )
      .subscribe((response) => {
        if (response.isSuccess && response.responseData) {
          this.initializeForm();
        } else {
          this.router.navigate(['/auth/link-expired', 'setNewPassword']);
        }
      });
  }

  get f() {
    return this.setNewPasswordForm.controls;
  }
  initializeForm() {
    this.setNewPasswordForm = new FormGroup(
      {
        newPassword: new FormControl('', [
          Validators.required,
          passwordValidator(),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          passwordValidator(),
        ]),
      },
      {
        validators: [MatchValidator('newPassword', 'confirmPassword')],
      } as FormControlOptions
    );
  }

  showMessagewithTimeout(isError: boolean, message?: string) {
    this.message = message;
    this.havingError = isError;
    this.isShowMessage = true;

    setTimeout(() => {
      this.isShowMessage = false;
    }, 5000);
  }

  onSubmit() {
    if (this.setNewPasswordForm.valid) {
      this.setNewPassword();
    }
  }
  setNewPassword() {
    this.loaderService.show();
    if (this.isSubmitting) return; // Prevent double submission
    this.isSubmitting = true;
    let newpassword = this.f['newPassword'].value;
    const setnewPasswordCommand: SetNewPasswordCommand = {
      PasswordrecoveryToken: this.passwordRecoveryToken,
      NewPassword: newpassword,
    };

    this.authService.setNewPassword(setnewPasswordCommand).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.setNewPasswordForm.reset();
          this.loaderService.hide();
          this.router.navigate(['auth/resetpasswordconfirmation']);
        }
      },
      error: (error: ResponseResult<boolean>) => {
        this.showMessagewithTimeout(true, error.messages?.[0]);
        this.loaderService.hide();
      },
    });
  }

  readonly getErrorMessage = (
    control: AbstractControl | null,
    fieldName: string
  ): string | null =>
    getErrorMessage(this.validationService, control, fieldName);
}
