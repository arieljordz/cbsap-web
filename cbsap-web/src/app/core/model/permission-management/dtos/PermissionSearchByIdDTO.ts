import { Role } from "../../user-management/role.model";
import { GroupPanelDTO } from "./GroupPanelDTO";

export interface PermissionSearchByIdDTO{

    PermissionID: number;
    permissionGroupName: string;
    groupPanel: GroupPanelDTO[];
    roles : Role[];
}