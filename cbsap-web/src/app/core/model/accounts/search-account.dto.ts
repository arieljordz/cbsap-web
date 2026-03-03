export interface SearchAccountLookupDto {
  accountID: number | null;
  accountName: string;
  entityName: string;
  active: string | null;
}

export interface AccountDto {
  accountID: number;
  accountName: string;
}
