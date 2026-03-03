import { UserIdentity } from '../common/userIdentity';
export interface SearchUserQuery extends UserIdentity {
  FullName: string | null;
  IsActive?: boolean | null;
  PageNumber: number | 1;
  PageSize: number | 10;
  SortField?: string;
  SortOrder?: number | null;
}

export interface SearchUserModel {
  name: string,
  username: string,
  isActive?: boolean | null
}