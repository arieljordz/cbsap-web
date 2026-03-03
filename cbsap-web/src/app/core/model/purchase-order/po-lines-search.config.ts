import { SearchField } from '../quick-search/QuickSearchModel';
import { SearchPOLinesModel } from './po-lines.query';

export interface SearchPOLinesConfig {
  fields: SearchField<SearchPOLinesModel>[];
  model: SearchPOLinesModel;
}

export function getDefaultSearchPOLinesModel(): SearchPOLinesModel {
  return {
    suppName: '',
    suppABN: '',
    poNo: '',
    poDateFrom: null,
    poDateTo: null,
    supplierNo: '',
    isAvailableOrder: true,
  };
}
export function buildSearchPOLinesConfig(): SearchPOLinesConfig {
  return {
    fields: [
      {
        key: 'suppName',
        label: 'Supplier Name',
        type: 'text',
        fieldType: 'input',
      },
       {
        key: 'supplierNo',
        label: 'Supplier No.',
        type: 'text',
        fieldType: 'input',
      },
      {
        key: 'suppABN',
        label: 'Supplier TaxID',
        type: 'text',
        fieldType: 'input',
      },
      {
        key: 'poNo',
        label: 'Purchase Order No',
        type: 'text',
        fieldType: 'input',
      },
      {
        key: 'poDateFrom',
        label: 'Order Date From',
        type: 'date',
        fieldType: 'input',
      },
      {
        key: 'poDateTo',
        label: 'Order Date To',
        type: 'date',
        fieldType: 'input',
      },     
      {
        key: 'isAvailableOrder',
        label: 'Available Order',
        type: 'bool',
        fieldType: 'input',
      },
    ],
    model: getDefaultSearchPOLinesModel(),
  };
}
