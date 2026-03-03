import { ReminderNotificationDTO } from './ReminderNotificationDTO';

export interface CreateRoleDTO {
  roleName: string;
  isActive: boolean;
  authorisationLimit: number | null;
  roleManager1: number | null;
  roleManager2: number | null;
  canBeAddedToInvoice: boolean;
  reminderNotification: ReminderNotificationDTO;
  rolePermissionGroups: number[];
  userRoles: number[];
  roleEntities:number[];
}
