import { UserModel } from "@prisma/client";

import { User } from "./user.entity";

export interface UsersRepositoryInterface {
  create(userData: User): Promise<UserModel>;
  find(email: string): Promise<UserModel | null>;
}
