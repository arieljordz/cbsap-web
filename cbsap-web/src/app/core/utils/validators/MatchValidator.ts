import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function MatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (matchingControl && control && control.value !== matchingControl.value) {
      matchingControl.setErrors({ mismatch: true }); 
      return { mismatch: true };
    }

    if (matchingControl?.errors?.['mismatch']) {
      delete matchingControl.errors['mismatch'];
      if (!Object.keys(matchingControl.errors).length) {
        matchingControl.setErrors(null);
      }
    }

    return null;
  };
}

