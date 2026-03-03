import { AbstractControl } from '@angular/forms';
import { inject } from '@angular/core';
import { ValidationService } from 'src/app/core/services/index';

export function getErrorMessage(
    validationService: ValidationService,
    control: AbstractControl | null,
    fieldName: string
  ): string | null {
    return validationService.getErrorMessage(control, fieldName);
  }


export function trackByValue<T>(index: number, item: T): T {
  return item;
}
