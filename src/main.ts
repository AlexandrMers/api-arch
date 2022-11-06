// For using DI
import { Container, ContainerModule } from "inversify";
import "reflect-metadata";

// Binding Types
import { TYPES } from "./bindingTypes";

// Types
import { ExceptionFilterInterface } from "errors/exception.filter.interface";
import { LoggerInterface } from "./logger/logger.interface";
import { UsersControllerInterface } from "./users/users.controller.interface";
import { UsersServiceInterface } from "./users/users.service.interface";
import { MiddlewareInterface } from "./common/middleware.interface";
import { ConfigServiceInterface } from "./config/config.service.interface";

// Application
import { App } from "./app";

// Controllers
import { UserController } from "users/users.controller";

// Services
import { LoggerService } from "logger/logger.service";
import { UsersService } from "./users/users.service";
import { ConfigService } from "./config/config.service";
import { PrismaService } from "./common/prisma.service";

// Middlewares
import { ValidateMiddleware } from "./common/validate.middleware";

// Utils
import { ExceptionFilter } from "errors/exception.filter";
import { PrismaServiceInterface } from "./common/prisma.service.interface";

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

  bind<App>(TYPES.APP).to(App);
});

function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.APP);
  app.init();
  return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
