import { Injectable } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  getErrorMessage(
    control: AbstractControl | null,
    fieldName: string
  ): string | null {
    if (!control || !control.errors || !control.touched) return null;

    if (control.errors['required']) {
      return `${fieldName} is required.`;
    }

    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `${fieldName} must be at least ${requiredLength} characters.`;
    }

    if (control.errors['maxlength']) {
      const requiredLength = control.errors['maxlength'].requiredLength;
      return `${fieldName} must be no more than ${requiredLength} characters.`;
    }

    if (control.errors['email']) {
      return `Invalid email format.`;
    }

    if (control.errors['pattern']) {
      return `${fieldName} format is invalid.`;
    }

    if (control.errors['mismatch']) {
      return `Passwords does not match.`;
    }
    if (control.errors['passwordRequirements']) {
      return `${fieldName} must contain at least one uppercase letter, one lowercase letter, one number, and one special character.`;
    }
    if (control.errors['min']) {
      const {
        min: { min },
      } = control.errors;
      return `${fieldName} must be at least ${min}.`;
    }

    if (control.errors?.['minLengthArray']) {
      const { requiredLength, actualLength } = control.errors['minLengthArray'];
      return `${fieldName} must have at least ${requiredLength} item(s). Currently has ${actualLength}.`;
    }

    return 'Invalid input.';
  }
}
