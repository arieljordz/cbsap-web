import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CustomButton,
  SearchField,
} from '@core/model/quick-search/QuickSearchModel';
import { PrimeImportsModule } from '@shared/moduleResources/prime-imports';
import { __setFunctionName } from 'tslib';

@Component({
  selector: 'app-quick-search',
  standalone: true,
  imports: [FormsModule, PrimeImportsModule, NgFor, NgIf],
  templateUrl: './quick-search.component.html',
  styleUrl: './quick-search.component.scss',
})
export class QuickSearchComponent<T extends Record<string, any>>
  implements OnInit
{
  @Input() fields: SearchField<T>[] = [];
  @Input() searchKey?: string
  @Input() actionButtons: {
    search?: boolean;
    clear?: boolean;
    export?: boolean;
    advancedSearch?:boolean;
    custom?: CustomButton[];
  } = { search: true, clear: true, export: false };

  @Input() addButtonLabel?: string;
  @Output() searchEvent = new EventEmitter<T>();
  @Output() clearEvent = new EventEmitter<void>();
  @Output() exportEvent = new EventEmitter<void>();
  @Output() addEvent = new EventEmitter<void>();

  model: Partial<T> = {};

  ngOnInit() {
    this.initializedFields();
  }
 

  search() {
    this.searchEvent.emit({ ...this.model } as T);
  }

  clear() {
    this.model = {};
    this.clearEvent.emit();
  }

  exportToExcel() {
    this.exportEvent.emit();
  }

  addItem() {
    this.addEvent.emit();
  }
  
  private initializedFields() {
    const parsed = JSON.parse(localStorage.getItem(this.searchKey || '') || '{}');
    for (const field of this.fields) {
      const key = field.key;
      if (field.fieldType === 'dropdown' &&
        field.options &&
        !(key in this.model)) {
        this.model[key] = field.options[0]?.value;
      }
    }
    if(parsed.length != 0){
        for (const [key, value] of Object.entries(parsed)) {
           const _field = this.fields.find(f => f.key == key);
          (this.model as any)[key] = value;
        }
    }
  }

}
