import { RoleDTO } from '../../roles-management';

export interface UserSearchPaginationDTO {
  userAccountID: number;
  userID: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  isActive: boolean;
  fullName: string;
  userRoles: RoleDTO[];
  countOfAssignedRoles: number;
  lastLoginDateTime : string;
  isLockedOut : boolean
}
