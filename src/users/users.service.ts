import { inject, injectable } from "inversify";
import "reflect-metadata";

// Types
import { TYPES } from "bindingTypes";
import { UsersServiceInterface } from "./users.service.interface";
import { LoggerInterface } from "logger/logger.interface";

// Entities
import { User } from "./user.entity";

// Services
import { ConfigService } from "config/config.service";

// DTO
import { UserRegisterDto } from "./dto/user-register.dto";
import { UsersRepositoryInterface } from "./users.repository.interface";
import { UserModel } from "@prisma/client";

@injectable()
export class UsersService implements UsersServiceInterface {
  constructor(
    @inject(TYPES.LOGGER) private logger: LoggerInterface,
    @inject(TYPES.CONFIG_SERVICE) private configService: ConfigService,
    @inject(TYPES.USERS_REPOSITORY)
    private usersRepository: UsersRepositoryInterface
  ) {
    logger.log(`Bind UsersService`);
  }

  async createUser(dto: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(dto.email, dto.name);
    const saltForUser = this.configService.get("SALT");
    await newUser.setPassword(dto.password, Number(saltForUser));

    const existedUser = await this.usersRepository.find(newUser.email);

    if (existedUser) {
      return null;
    }

    return this.usersRepository.create(newUser);
  }

  async validateUser(login: string): Promise<Boolean> {
    return true;
  }
}
