import { GroupPanelDTO } from '../dtos/GroupPanelDTO';

export interface PermissionCommand {
  PermissionName: string;
  GroupPanel: GroupPanelDTO[];
  Roles:number[]
}
