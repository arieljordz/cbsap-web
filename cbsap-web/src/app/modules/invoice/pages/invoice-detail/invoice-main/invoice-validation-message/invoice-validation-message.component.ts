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
  @Input() reason: string = '';
  trackByValue = trackByValue;
  isSuccess = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages'] && this.messages?.length > 0) {
      this.isSuccess = this.messages.some((msg) => msg.includes('No error'));
    }
  }

  ShowReason() : boolean {
    
    //lower case and replace the spacing to making sure that has same value
    var hasDuplicate = false;
    if(this.reason != '') {
      const cleanMessages = this.messages.map(m => m.toLowerCase().replace(/\s+/g, ''));
      const cleanReason = this.reason.toLowerCase().replace(/\s+/g, '');

      hasDuplicate = cleanMessages.some((msg) => msg.includes(cleanReason));
    }
    

    return (this.reason != '' && !hasDuplicate) ? true : false;

  }
}
