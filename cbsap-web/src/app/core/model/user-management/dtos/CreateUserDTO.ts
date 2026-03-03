export interface CreateUserDTO {
    userID: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    isActive: boolean;
    userRoles: number[];
}