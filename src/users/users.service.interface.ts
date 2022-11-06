import { UserModel } from "@prisma/client";

import { UserRegisterDto } from "./dto/user-register.dto";

export interface UsersServiceInterface {
  createUser(dto: UserRegisterDto): Promise<UserModel | null>;
  validateUser(login: string): Promise<Boolean>;
}
