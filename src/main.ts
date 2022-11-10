// For using DI
import { Container, ContainerModule } from "inversify";
import "reflect-metadata";

// Binding Types
import { TYPES } from "./bindingTypes";

// Interfaces
import { ExceptionFilterInterface } from "errors/exception.filter.interface";
import { LoggerInterface } from "./logger/logger.interface";
import { UsersControllerInterface } from "./users/users.controller.interface";
import { UsersServiceInterface } from "./users/users.service.interface";
import { MiddlewareInterface } from "./common/middleware.interface";
import { ConfigServiceInterface } from "./config/config.service.interface";
import { PrismaServiceInterface } from "./common/prisma.service.interface";
import { UsersRepositoryInterface } from "./users/users.repository.interface";

// Application
import { App } from "./app";

// Controllers
import { UserController } from "users/users.controller";

// Services
import { LoggerService } from "logger/logger.service";
import { UsersService } from "./users/users.service";
import { ConfigService } from "./config/config.service";
import { PrismaService } from "./common/prisma.service";

// Repositories
import { UsersRepository } from "./users/users.repository";

// Middlewares
import { ValidateMiddleware } from "./common/validate.middleware";

// Utils
import { ExceptionFilter } from "errors/exception.filter";

const appBindings = new ContainerModule((bind) => {
  bind<LoggerInterface>(TYPES.LOGGER).to(LoggerService).inSingletonScope();
  bind<ExceptionFilterInterface>(TYPES.EXCEPTION_FILTER).to(ExceptionFilter);
  bind<UsersControllerInterface>(TYPES.USER_CONTROLLER).to(UserController);
  bind<UsersServiceInterface>(TYPES.USER_SERVICE).to(UsersService);
  bind<MiddlewareInterface>(TYPES.VALIDATOR_MIDDLEWARE).toConstructor(
    ValidateMiddleware
  );
  bind<ConfigServiceInterface>(TYPES.CONFIG_SERVICE)
    .to(ConfigService)
    .inSingletonScope();

  bind<PrismaServiceInterface>(TYPES.PRISMA_SERVICE)
    .to(PrismaService)
    .inSingletonScope();

  bind<UsersRepositoryInterface>(TYPES.USERS_REPOSITORY)
    .to(UsersRepository)
    .inSingletonScope();

  bind<App>(TYPES.APP).to(App);
});

async function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.APP);
  await app.init();
  return { appContainer, app };
}

export const boot = bootstrap();
