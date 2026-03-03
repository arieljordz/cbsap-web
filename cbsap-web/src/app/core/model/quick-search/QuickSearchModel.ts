import { SelectItem } from 'primeng/api';

export interface SearchField<T> {
  key: keyof T;
  label: string;
  type: 'text' | 'number' | 'date' | 'bool'; // input types
  fieldType: 'input' | 'dropdown' | 'calendar';
  options?: SelectItem[]; // updated to use SelectItem from PrimeNG
}

export type ButtonSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'help'
  | 'primary'
  | 'secondary'
  | 'contrast'
  | null
  | undefined;

export interface CustomButton {
  label: string;
  icon?: string;
  severity?: ButtonSeverity;
  action: () => void;
  outlined?: boolean;
}
