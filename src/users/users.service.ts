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

@injectable()
export class UsersService implements UsersServiceInterface {
  constructor(
    @inject(TYPES.LOGGER) private logger: LoggerInterface,
    @inject(TYPES.CONFIG_SERVICE) private configService: ConfigService
  ) {
    logger.log(`Bind UsersService`);
  }

  async createUser(dto: UserRegisterDto): Promise<User | null> {
    const newUser = new User(dto.email, dto.login);
    const saltForUser = this.configService.get("SALT");
    await newUser.setPassword(dto.password, Number(saltForUser));
    // Проверка, существует ли пользователь
    // Если существует возвращаем null,
    // Иначе создаём нового пользователя
    return null;
  }

  async validateUser(login: string): Promise<Boolean> {
    return true;
  }
}
