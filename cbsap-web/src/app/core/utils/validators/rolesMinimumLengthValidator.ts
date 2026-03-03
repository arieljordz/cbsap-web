import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function rolesMinimumLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: any[] = control.value;

    if (value && value.length >= minLength) {
      return null;
    } else {
      return { 'rolesMinimumLength': { requiredLength: minLength, actualLength: value ? value.length : 0 } };
    }
  };
}