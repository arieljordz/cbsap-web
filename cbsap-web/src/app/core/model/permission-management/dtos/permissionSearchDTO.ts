export interface PermissionSearchDTO {
  permissionID: number;
  permissionName: string;
  permissionGroupName: string;
  countofRoles: number;
  countofUsers: number;
  isActive: boolean;
}


export interface PermissionSearchModel {
    permissionID? : number | null;
    permissionName: string;
    isActive?: boolean | null
}