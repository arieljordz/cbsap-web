import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';

@Component({
  selector: 'app-reminder-notification',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, PrimeImportsModule],
  templateUrl: './reminder-notification.component.html',
  styleUrl: './reminder-notification.component.scss',
})
export class ReminderNotificationComponent {
    @Input() formGroup!: FormGroup;
    
}
