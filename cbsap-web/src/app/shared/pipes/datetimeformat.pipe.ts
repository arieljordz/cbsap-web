import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datetimeformat',
    standalone: true
})
export class DateTimeFormatPipe implements PipeTransform {

  transform(value: Date): string {
    var datePipe = new DatePipe("en-US");
    let val = datePipe.transform(value, 'dd/MM/yyyy hh:mm a');
    if (val==null){
      return '';
    }
    return val;
  }

}
