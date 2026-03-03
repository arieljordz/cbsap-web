export interface UpdateUserDTO {
    userAccountID: number;
    userID: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string | null;
    isActive: boolean;
    userRoles: number[];
    isPasswordMandatory: boolean;
}