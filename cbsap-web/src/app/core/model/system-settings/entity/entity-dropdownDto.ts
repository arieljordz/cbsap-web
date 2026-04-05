import { SelectItem } from "primeng/api";

export interface EntityDropdownDto {
    matchingLevel: string[];
    invoiceMatchBasis: string[];
    allowPresets: SelectItem[];
  }