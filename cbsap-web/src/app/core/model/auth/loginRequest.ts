export interface LoginRequest {
  Username: string;
  Password: string;
}

export interface SwitchRoleRequest {  
  roleId:number
}

export interface AuthenticationResult {
  userName: string;
  token: string;
}
