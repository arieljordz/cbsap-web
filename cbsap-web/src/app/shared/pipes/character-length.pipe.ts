import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'characterLength',
  standalone: true
})
export class CharacterLengthPipe implements PipeTransform {

  transform(value: string, maxLength: number = 50): any {
    const length = value?.length || 0;
    const approachingLimit = length >= maxLength - 5;

    return {
      length,
      approachingLimit,
      maxLength,
    };
  }

}
