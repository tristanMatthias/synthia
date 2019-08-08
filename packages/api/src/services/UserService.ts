import { BaseService } from "./BaseService";
import { User } from "../models/User";

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  socialId: string;
  socialPic: string;
}

export interface UpdateUser extends CreateUser {
  id: string;
}
export interface GetUser {
  id: string;
}


export const UserService = new class extends BaseService<
  User,
  CreateUser,
  UpdateUser,
  GetUser
> {
  findByEmail(email: string) {
    return User.findOne({where: {email}})
  }
}(User)
