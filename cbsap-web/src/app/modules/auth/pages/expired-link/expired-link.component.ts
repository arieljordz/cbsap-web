import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';

@Component({
  selector: 'app-expired-link',
  standalone: true,
  imports: [PrimeImportsModule],
  templateUrl: './expired-link.component.html',
  styleUrl: './expired-link.component.scss',
})
export class ExpiredLinkComponent implements OnInit {
  message: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const mode = params.get('mode');

      if (mode === 'userActivation') {
        this.message =
          "The link you're trying to access is no longer valid or has expired. Please go back to the log in page and reset your password. If other issues occurred, please contact your administrator.";
      } else {
        this.message =
          "The link you're trying to access is no longer valid or has expired. Please request a new link. If the issue persists, contact your administrator.";
      }
    });
  }

  goToMainPage() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
