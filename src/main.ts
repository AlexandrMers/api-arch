import { Container, ContainerModule } from "inversify";

// Application
import { App } from "./app";

// Controllers
import { UserController } from "users/users.controller";

// Services
import { LoggerService } from "logger/logger.service";

// Utils
import { ExceptionFilter } from "errors/exception.filter";

// Binding Types
import { TYPES } from "./bindingTypes";

// Types
import { ExceptionFilterInterface } from "errors/exception.filter.interface";
import { LoggerInterface } from "./logger/logger.interface";
import { UsersControllerInterface } from "./users/users.controller.interface";

// For using DI
import "reflect-metadata";

const appBindings = new ContainerModule((bind) => {
  bind<LoggerInterface>(TYPES.LOGGER).to(LoggerService);
  bind<ExceptionFilterInterface>(TYPES.EXCEPTION_FILTER).to(ExceptionFilter);
  bind<UsersControllerInterface>(TYPES.USER_CONTROLLER).to(UserController);
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
