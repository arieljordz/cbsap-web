import {
  CustomButton,
  SearchField,
} from '@core/model/quick-search/QuickSearchModel';
import { MyInvoiceSearchModel } from './invoice.query';

export interface MyInvoiceSearchConfig {
  fields: SearchField<MyInvoiceSearchModel>[];
  model: MyInvoiceSearchModel;
  buttons: {
    search: boolean;
    clear: boolean;
    export: boolean;
    advancedSearch:boolean,
    custom?: CustomButton[];
  };
}

export function buildMyInvoiceSearchConfig(
  customButtons?: CustomButton[]
): MyInvoiceSearchConfig {
  return {
    fields: [
      {
        key: 'suppName',
        label: 'Supplier Name',
        type: 'text',
        fieldType: 'input',
      },
      {
        key: 'invNo',
        label: 'Invoice Number',
        type: 'text',
        fieldType: 'input',
      },
      {
        key: 'poNo',
        label: 'PO Number',
        type: 'text',
        fieldType: 'input',
      },
    ],
    model: {
      suppName: '',
      invNo: '',
      poNo: '',
    },
    buttons: {
      search: true,
      clear: true,
      export: true,
      advancedSearch:true,
      custom: customButtons,
    },
  };
}
