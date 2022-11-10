import { UserModel } from "@prisma/client";

import { UserRegisterDto } from "./dto/user-register.dto";
import { UserLoginDto } from "./dto/user-login.dto";

export interface UsersServiceInterface {
  createUser(dto: UserRegisterDto): Promise<UserModel | null>;
  validateUser(user: UserLoginDto): Promise<Boolean>;
  getUserInfo(email: string): Promise<UserModel | null>;
}
