import { inject, injectable } from "inversify";

// Binding Types
import { TYPES } from "bindingTypes";

// Models
import { UserModel } from "@prisma/client";

// Types
import { UsersRepositoryInterface } from "./users.repository.interface";
import { PrismaServiceInterface } from "common/prisma.service.interface";
import { LoggerInterface } from "logger/logger.interface";

// Entities
import { User } from "./user.entity";

@injectable()
export class UsersRepository implements UsersRepositoryInterface {
  constructor(
    @inject(TYPES.LOGGER) private readonly loggerService: LoggerInterface,
    @inject(TYPES.PRISMA_SERVICE)
    private readonly prismaService: PrismaServiceInterface
  ) {
    this.loggerService.log(`[${this.constructor.name}]: bind`);
  }

  create(userData: User): Promise<UserModel> {
    return this.prismaService.client.userModel.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: userData.password,
      },
    });
  }

  find(email: string): Promise<UserModel | null> {
    return this.prismaService.client.userModel.findFirst({
      where: {
        email,
      },
    });
  }
}
