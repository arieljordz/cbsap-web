import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    if (!value) {
      return null;
    }

    // Check if the password meets all the requirements
    const isValid =
      value && value.length >= 8 && value.length <= 20 &&
      /[A-Z]/.test(value) && // At least one uppercase letter
      /[a-z]/.test(value) && // At least one lowercase letter
      /\d/.test(value) && // At least one digit
      /[!@#$%^&*(),.?":{}|<>]/.test(value); // At least one special character

    return isValid ? null : { 'passwordRequirements': true };
  };
}