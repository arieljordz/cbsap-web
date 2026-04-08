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

export function formatDate(date: any): string | null {
  if (!date) return null;
 
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
 
  return `${yyyy}-${mm}-${dd}`;
}
 
export function formatToIsoDate(date: Date | string | null): string | null {
  if (!date) return null;
 
  let d: Date;
 
  if (typeof date === 'string') {
    d = new Date(date); // convert string to Date
  } else {
    d = date;
  }
 
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
 
  return `${yyyy}-${mm}-${dd}`;
}

