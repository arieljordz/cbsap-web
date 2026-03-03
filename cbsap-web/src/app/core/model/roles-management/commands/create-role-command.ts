import { RoleReminderNotificationDto } from '../dtos/RoleSearchDTO';

export interface CreateRoleCommand {
  roleName: string;
  isActive: boolean;
  authorisationLimit: number | null;
  roleManager1: number | null;
  roleManager2: number | null;
  canBeAddedToInvoice: boolean;
  reminderNotification?: RoleReminderNotificationDto;
  rolePermissionGroups: number[];
  userRoles: number[];
  roleEntities: number[];
}
