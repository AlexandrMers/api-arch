import { User } from "./user.entity";

import { UserRegisterDto } from "./dto/user-register.dto";

export interface UsersServiceInterface {
  createUser(dto: UserRegisterDto): Promise<User | null>;
  validateUser(login: string): Promise<Boolean>;
}
