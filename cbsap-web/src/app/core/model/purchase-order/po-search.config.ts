import { SearchField } from '../quick-search/QuickSearchModel';
import { SearchPOModel } from './po.query';
import { getStatusFilterOptions } from '@core/constants';

export interface SearchPOConfig {
  fields: SearchField<SearchPOModel>[];
  model: SearchPOModel;
  buttons: {
    search: boolean;
    clear: boolean;
    export: boolean;
  };
}

export function getDefaultSearchPOModel(): SearchPOModel {
  return {
    entityName: '',
    poNo: '',
    supplierName: '',
    isActive: null,
    goodReceipt: '',
  };
}

export function buildSearchPOConfig(): SearchPOConfig {
  return {
    fields: [
      {
        key: 'poNo',
        label: 'PO Number',
        type: 'text',
        fieldType: 'input',
      },
      {
        key: 'entityName',
        label: 'Entity Name',
        type: 'text',
        fieldType: 'input',
      },
      {
        key: 'supplierName',
        label: 'Supplier',
        type: 'text',
        fieldType: 'input',
      },
      {
        key: 'isActive',
        label: 'IsActive',
        type: 'bool',
        fieldType: 'dropdown',
        options: getStatusFilterOptions(),
      },
      {
        key: 'goodReceipt',
        label: 'Good Receipt',
        type: 'text',
        fieldType: 'input',
      },
    ],
    model: {  
      entityName: '',
      poNo: '',
      supplierName: '',
      isActive: null,
      goodReceipt: '',
    },
    buttons: {
      search: true,
      clear: true,
      export: true,
    },
  };
}


