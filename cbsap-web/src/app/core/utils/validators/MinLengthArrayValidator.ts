import { AbstractControl, FormArray } from '@angular/forms';

export function minLengthArray(min: number) {
  return (control: AbstractControl) => {
    const array = control as FormArray;
    return array.length >= min
      ? null
      : { minLengthArray: { requiredLength: min, actualLength: array.length } };
  };
}
