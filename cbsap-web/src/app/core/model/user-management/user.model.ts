import { Role } from './role.model';

export interface User {
  userAccountID: number;
  userID: string;
  firstName: string;
  emailAddress: string;
  lastName: string;
  isActive: boolean;
  fullName: string;
  userRoles: Role[];
  countOfAssignedRoles: number;
  lastLoginDateTime: string;
  isLockedOut: boolean;
}
