      import { NgClass, NgFor, NgIf } from '@angular/common';

      import { MultiSelectModule } from 'primeng/multiselect';

      import {

       Component,

       EventEmitter,

       Input,

       OnDestroy,

       OnInit,

       Output,

       SimpleChanges,

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

    imports: [FormsModule, PrimeImportsModule, MultiSelectModule, NgFor, NgIf, NgClass],

    templateUrl: './quick-search.component.html',

    styleUrl: './quick-search.component.scss',

    })



     export class QuickSearchComponent<T extends Record<string, any>,


       > implements OnInit {

       @Input() fields: SearchField<T>[] = [];

  @Input() searchKey?: string;

 @Input() actionButtons: {

 search?: boolean;

 clear?: boolean;

  export?: boolean;

 advancedSearch?: boolean;

 custom?: CustomButton[];

  } = { search: true, clear: true, export: false };



   @Input() addButtonLabel?: string;

   @Output() searchEvent = new EventEmitter<T>();

   @Output() clearEvent = new EventEmitter<void>();

   @Output() exportEvent = new EventEmitter<void>();

   @Output() addEvent = new EventEmitter<void>();

   @Output() advanceSearchEvent = new EventEmitter<void>();

 

   model: Partial<T> = {};

   groupedRows: { row: number; fields: SearchField<T>[] }[] = [];



 ngOnInit() {

 this.initializedFields();

 this.groupFieldsByRow();

 }



   ngOnChanges(changes: SimpleChanges) {

   if (changes['fields'] && !changes['fields'].firstChange) {

  this.groupFieldsByRow();

   }

 }

 

 search() {

   this.searchEvent.emit({ ...this.model } as T);

  }
  advanceSearch(){
      this.advanceSearchEvent.emit();
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

 

      getGridColsClass(count: number): string {

        const map: Record<number, string> = {

        1: 'grid-cols-1',

        2: 'grid-cols-2',

       3: 'grid-cols-3',

        4: 'grid-cols-4',

        5: 'grid-cols-5',

       6: 'grid-cols-6',
   
       7: 'grid-cols-7',
       8: 'grid-cols-8',

         };

      return map[count] || `grid-cols-${count}`;

 }



                      private groupFieldsByRow() {

                 const map = new Map<number, SearchField<T>[]>();

                   for (const field of this.fields) {

               const row = field.row ?? 0;

                  if (!map.has(row)) map.set(row, []);

              map.get(row)!.push(field);

                  }

             this.groupedRows = Array.from(map.entries())

                 .sort(([a], [b]) => a - b)

                .map(([row, fields]) => ({ row, fields }));

          }


                   private initializedFields() {

                const parsed = JSON.parse(

               localStorage.getItem(this.searchKey || '') || '{}',

               );
     
           for (const field of this.fields) {

            const key = field.key;

                if (

           field.fieldType === 'dropdown' &&

                  field.options &&

               !(key in this.model)

                ) {

                      this.model[key] = field.options[0]?.value;

            }

             }

                   if (parsed.length != 0) {

                      for (const [key, value] of Object.entries(parsed)) {

                const _field = this.fields.find((f) => f.key == key);

             (this.model as any)[key] = value;

       }
          }

           }



   getOptionsWithAll(field: SearchField<T>) {

    return [{ label: 'All', value: '__ALL__' }, ...(field.options || [])];

    }



    onMultiSelectChange(field: SearchField<T>, value: any[]) {

    const allValues = field.options?.map((o) => o.value) || [];



    const clickedAll = value.includes('__ALL__');

    const cleanedValue = value.filter((v) => v !== '__ALL__');



    const isAllSelectedNow = cleanedValue.length === allValues.length;



 // Select all

    if (clickedAll && !isAllSelectedNow) {

   this.model[field.key as keyof T] = ['__ALL__', ...allValues] as any;

   return;

   }



   // Unselect all

    if (isAllSelectedNow) {

   this.model[field.key as keyof T] = [] as any;

    return;

    }



        // Manual selection

           this.model[field.key as keyof T] = cleanedValue as any;

   }



                  isRange(field: SearchField<T>): boolean {

         return field.fieldType === 'range';

    }



 isRangeStart(field: SearchField<T>): boolean {

   return this.isRange(field) && field.key.toString().endsWith('From');

 }



 isRangeEnd(field: SearchField<T>): boolean {

   return this.isRange(field) && field.key.toString().endsWith('To');

   }

 

 getRangePairKey(field: SearchField<T>): keyof T {

 return field.key.toString().replace('From', 'To') as keyof T;

 }

}