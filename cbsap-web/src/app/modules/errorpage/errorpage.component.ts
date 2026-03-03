import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { AuthService, LocalStorageService } from 'src/app/core/services';

@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.component.scss'],
  standalone: true,
  imports: [Button],
})
export class ErrorpageComponent {
  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private authService : AuthService
  ) {}
  goToMainPage() {
    
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
