export interface ActivateUserCommand {
 ConfirmationToken: string,
  TempPassword: string,
  NewPassword: string,
  ActivateUser: boolean
  }