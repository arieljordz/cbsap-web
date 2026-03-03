import { SelectItem  } from "primeng/api";

export function getStatusFilterOptions() : SelectItem[] {

    return  [
        { label: 'All', value: null },
        { label: 'Yes', value: true },
        { label: 'No', value: false },
    ]
}