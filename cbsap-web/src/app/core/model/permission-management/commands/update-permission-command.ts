import { GroupPanelDTO } from "../dtos/GroupPanelDTO";

export interface UpdatePermissionCommand {
    PermissionID: number;
    PermissionName: string;
    GroupPanel: GroupPanelDTO[];
    Roles:number[]
  }
  