import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormControlOptions,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ActivateUserCommand } from 'src/app/core/model/auth/activate-user-command';
import { ResponseResult } from 'src/app/core/model/common';
import {
  AuthService,
  LoaderService,
  ValidationService,
} from 'src/app/core/services';
import {
  getErrorMessage,
  MatchValidator,
  passwordValidator,
} from 'src/app/core/utils';
import { PrimeImportsModule } from 'src/app/shared/moduleResources/prime-imports';

@Component({
  selector: 'app-new-user-verification',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeImportsModule, NgIf],
  templateUrl: './new-user-verification.component.html',
  styleUrl: './new-user-verification.component.scss',
})
export class NewUserVerificationComponent implements OnInit {
  confirmUserForm!: FormGroup;
  isSubmitting: boolean = false;
  isShowMessage: boolean = false;
  havingError: boolean = false;
  message?: string | null;

  confirmationToken: string = '';
  isNewUser: boolean = false;
  isTokenValidated: boolean = false;

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private validationService: ValidationService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.confirmationToken = this.activeRoute.snapshot.params['ct'];
    this.isNewUser =
      this.activeRoute.snapshot.params['isnu'].toLowerCase() === 'true';
  }

  ngOnInit(): void {
    this.verfiyTokenValidity();
  }

  verfiyTokenValidity() {
    this.loaderService.show();
    this.authService
      .isActivateNewUserLinkValid(this.confirmationToken)
      .pipe(
        finalize(() => {
          this.loaderService.hide();
          this.isTokenValidated = true;
        })
      )
      .subscribe((response) => {
        if (response.isSuccess && response.responseData) {
          this.initializedForm(); // Only initialize form if token is valid
        } else {
          this.router.navigate(['/auth/link-expired', 'userActivation']);
        }
      });
  }

  onSubmit() {
    if (this.confirmUserForm.valid) {
      this.activateNewUser();
    }
  }

  activateNewUser() {
    this.loaderService.show();
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    const activateNewUserCommand: ActivateUserCommand = {
      ConfirmationToken: this.confirmationToken,
      ActivateUser: this.isNewUser,
      ...this.confirmUserForm.value,
    };

    this.authService.activateNewUser(activateNewUserCommand).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.confirmUserForm.reset();
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

  initializedForm() {
    this.confirmUserForm = new FormGroup(
      {
        tempPassword: new FormControl('', [
          Validators.required,
          passwordValidator(),
        ]),
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
  get f() {
    return this.confirmUserForm.controls;
  }

  readonly getErrorMessage = (
    control: AbstractControl | null,
    fieldName: string
  ): string | null =>
    getErrorMessage(this.validationService, control, fieldName);
}
