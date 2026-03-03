import { UpdateReminderNotificationDTO } from './UpdateReminderNotificationDTO';

export interface UpdateRoleDTO {
    roleID: number;
    roleName: string | null;
    isActive: boolean;
    authorisationLimit: number | null;
    roleManager1: number | null;
    roleManager2: number | null;
    canBeAddedToInvoice: boolean;
    reminderNotification: UpdateReminderNotificationDTO;
    newRolePermissionGroups: number[];
    removeRolePermissionGroups: number[];
    newUserRoles: number[];
    removeUserRoles: number[];
    newRoleEntities: number[];
    removeRoleEntities: number[];
}