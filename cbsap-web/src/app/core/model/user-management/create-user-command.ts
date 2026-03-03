import { UserIdentity } from "../common/index";

export interface CreateUserCommand extends UserIdentity {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password?: string | null;
  isActive: boolean;
  createdBy?: string | null;
  roles:number[];
}
