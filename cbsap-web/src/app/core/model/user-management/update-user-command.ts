import { CreateUserCommand } from 'src/app/core/model/user-management/index';
import { UserIdentity } from "../common/userIdentity";

export interface UpdateUserCommand extends UserIdentity, CreateUserCommand {
  userAccountID: number;
  updatedBy: string;
  isPasswordMandatory: boolean | false;
  
}
