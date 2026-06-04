import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { trackByValue } from '@core/utils';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';

@Component({
  selector: 'app-invoice-validation-message',
  standalone: true,
  imports: [PrimeImportsModule, NgIf, NgFor],
  templateUrl: './invoice-validation-message.component.html',
  styleUrl: './invoice-validation-message.component.scss',
})
export class InvoiceValidationMessageComponent implements OnChanges {
  @Input() messages: string[] = [];
  @Input() invoiceValidationHeader: string = '';
  trackByValue = trackByValue;
  isSuccess = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages'] && this.messages?.length > 0) {
      this.isSuccess = this.messages.some((msg) => msg.includes('No error'));
    }
  }
}
