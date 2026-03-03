import { getStatusFilterOptions } from '@core/constants/common/statusFilterOptions';
import { SearchField } from '../quick-search/QuickSearchModel';
import { SearchAccountLookupDto } from './search-account.dto';
import { SearchAccountModel } from './search-account.model';

export interface SearchAccountConfig {
  fields: SearchField<SearchAccountModel>[];
  model: SearchAccountModel;
}

export function getDefaultSearchAccountModel(): SearchAccountModel {
  return {
    accountID: null,
    accountName: '',
    entityName: '',
    active: null,
  };
}

export function buildSearchAccountConfig(): SearchAccountConfig {
  return {
    fields: [
      {
        key: 'accountID',
        label: 'Account ID',
        type: 'text',
        fieldType: 'input',
      },
      {
        key: 'accountName',
        label: 'Account Name',
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
        key: 'active',
        label: 'Active',
        type: 'bool',
        fieldType: 'dropdown',
        options: getStatusFilterOptions(),
      },
    ],
    model: getDefaultSearchAccountModel(),
  };
}
