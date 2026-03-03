import { PermissionValues } from "./permission";

export interface AccessToken {
    exp: number;
    role: string | string[];
    permission: PermissionValues | PermissionValues[];
    authorisationlimit: string;
}
