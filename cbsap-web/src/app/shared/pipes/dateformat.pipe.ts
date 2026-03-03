import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateformat',
    standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: Date): string {
    var datePipe = new DatePipe("en-US");
    let val = datePipe.transform(value, 'dd/MM/yyyy');
    if (val==null){
      return '';
    }
    return val;
  }

}
