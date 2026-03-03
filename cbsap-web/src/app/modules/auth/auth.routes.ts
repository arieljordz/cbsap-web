import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { SetNewPasswordComponent } from './pages/set-new-password/set-new-password.component';
import { PasswordResetConfirmComponent } from './pages/password-reset-confirm/password-reset-confirm.component';
import { NewUserVerificationComponent } from './pages/new-user-verification/new-user-verification.component';
import { ExpiredLinkComponent } from './pages/expired-link/expired-link.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'forgotpassword',
        component: ForgotPasswordComponent,
      },
      {
        path: 'cbsap-snp/:prt', // (snp) - set new password / (prr) password recovery token
        component: SetNewPasswordComponent,
      },
      {
        path: 'link-expired/:mode', // (mode) - user activation or password reset
        component: ExpiredLinkComponent,
      },
      {
        path: 'resetpasswordconfirmation', // confirmation-token
        component: PasswordResetConfirmComponent,
      },


      {
        path: 'user-verification/:ct/:isnu', // (ct) - confirmation token 
        component: NewUserVerificationComponent,
      },
    ],
  },
];
