import { Container, ContainerModule } from "inversify";

// For using DI
import "reflect-metadata";

// Application
import { App } from "./app";

// Controllers
import { UserController } from "users/users.controller";

// Services
import { LoggerService } from "logger/logger.service";
import { UsersService } from "./users/users.service";

// Middlewares
import { ValidateMiddleware } from "./common/validate.middleware";

// Utils
import { ExceptionFilter } from "errors/exception.filter";

// Binding Types
import { TYPES } from "./bindingTypes";

// Types
import { ExceptionFilterInterface } from "errors/exception.filter.interface";
import { LoggerInterface } from "./logger/logger.interface";
import { UsersControllerInterface } from "./users/users.controller.interface";
import { UsersServiceInterface } from "./users/users.service.interface";
import { MiddlewareInterface } from "./common/middleware.interface";

const appBindings = new ContainerModule((bind) => {
  bind<LoggerInterface>(TYPES.LOGGER).to(LoggerService);
  bind<ExceptionFilterInterface>(TYPES.EXCEPTION_FILTER).to(ExceptionFilter);
  bind<UsersControllerInterface>(TYPES.USER_CONTROLLER).to(UserController);
  bind<UsersServiceInterface>(TYPES.USER_SERVICE).to(UsersService);
  bind<MiddlewareInterface>(TYPES.VALIDATOR_MIDDLEWARE).toConstructor(
    ValidateMiddleware
  );
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
