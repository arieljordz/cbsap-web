import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toleranceLabel',
  standalone: true,
})
export class ToleranceLabelPipePipe implements PipeTransform {

  transform(type: string | null, mode: 'prefix' | 'suffix'): string {
    if (!type) return '';

    if (mode === 'prefix') {
      return type === 'Dollar' ? '$' : '';
    }

    if (mode === 'suffix') {
      return type === 'Percent' ? '%' : '';
    }

    return '';
  }

}
