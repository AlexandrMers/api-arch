import { inject, injectable } from "inversify";
import "reflect-metadata";

// Types
import { TYPES } from "bindingTypes";
import { UsersServiceInterface } from "./users.service.interface";

// Entities
import { User } from "./user.entity";

// Services
import { LoggerInterface } from "logger/logger.interface";

// DTO
import { UserRegisterDto } from "./dto/user-register.dto";

@injectable()
export class UsersService implements UsersServiceInterface {
  constructor(@inject(TYPES.LOGGER) private logger: LoggerInterface) {
    logger.log(`Bind UsersService`);
  }

  async createUser(dto: UserRegisterDto): Promise<User | null> {
    const newUser = new User(dto.email, dto.login);
    await newUser.setPassword(dto.password);
    // Проверка, существует ли пользователь
    // Если существует возвращаем null,
    // Иначе создаём нового пользователя
    return null;
  }

  async validateUser(login: string): Promise<Boolean> {
    return true;
  }
}
