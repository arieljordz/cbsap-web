import { GetAllEntityDto } from "./GetAllEntityDTO";


export interface EntityRoleDto {
    roleID: number;
    entityProfiles: GetAllEntityDto[];
}