import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AuthenticationResult,
  LoginRequest,
} from 'src/app/core/model/auth/loginRequest';
import { ResponseResult } from 'src/app/core/model/common';
import { AuthService, LoaderService } from 'src/app/core/services';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Password as Password_1 } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    InputText,
    Password_1,
    RouterLink,
    ButtonModule,
    MessageModule,
    NgIf,
    
  ],
})
export class LoginComponent implements OnDestroy {
  loginRequest: LoginRequest = { Username: '', Password: '' };
  messages2?: string | null;
  errorMessage?: string | null = null;
  isShowErrorMessage: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private loaderService: LoaderService
  ) {}
  ngOnDestroy(): void {
   this.loaderService.hide();
  }

  login(): void {
    this.loaderService.show();
    this.authenticationService.login(this.loginRequest).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.router.navigate(['/home']);
         // this.loaderService.hide();
        } else {
        }
      },
      error: (error: ResponseResult<AuthenticationResult>) => {

        if(error.statusCode  === 401) 
        {
          const message = error.messages?.  [0] || 'Unauthorized';
          if(message.includes('locked')){
             this.messages2 = "Account Locked. Please contact your administrator";
          }
          else {
            this.messages2 = "Invalid username or password";

          }
        }
        this.isShowErrorMessage = true;
       
        this.loaderService.hide();
      },
    });
  }
}
