export interface RoleSearchDTO {
  roleID: number;
  entity: string;
  roleName: string;
  roleManager1: string | null;
  roleManager2: string | null;
  roleManager1Name: string | null;
  roleManager2Name: string | null;
  authorisationLimit: number;
  permissionGroups: string | null;
  isActive: boolean;
  canBeAddedToInvoice: boolean;
}

export interface RoleDto {
  roleID: number;
  roleName: string;
  roleManager1: number | null;
  roleManager2: number | null;
  roleManager1Name: string | null;
  roleManager2Name: string | null;
  authorisationLimit: number;
  isActive: boolean;
  canBeAddedToInvoice: boolean;
  reminderNotification: RoleReminderNotificationDto;
  roleEntities: RoleEntitiyDto[] | null;
  rolePermissions: RolePermissionDto[] | null;
  roleUsers: RoleUserDto[] | null;
}

export interface RolePermissionDto {
  permissionID: number;
  permissionName: string;
}

export interface RoleEntitiyDto {
  entityProfileID: number;
  entityName: string;
  entityCode: string;
}

export interface RoleUserDto {
  userAccountID: number;
  userID: string;
  fullName: string;
}

export interface RoleReminderNotificationDto {
    isNewInvoiceReceiveNotification: boolean;
    invoiceDueDateNotification: number | null;
    invoiceEscalateToLevel1ManagerNotification: number | null;
    forwardToLevel1Manager: number | null;
    forwardToLevel2Manager: number | null;
}

export interface RoleSearchModel {
  entityName: string;
  roleName: string;
  isActive: boolean | null;
}