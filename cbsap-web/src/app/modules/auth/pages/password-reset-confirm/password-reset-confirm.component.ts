import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset-confirm',
  standalone: true,
  imports: [],
  templateUrl: './password-reset-confirm.component.html',
  styleUrl: './password-reset-confirm.component.scss'
})
export class PasswordResetConfirmComponent {

  constructor(private router : Router) {
     
  }

  goToLoginPage() {
      this.router.navigate(['auth/login']);
  }
}
