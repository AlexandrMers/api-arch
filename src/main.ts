import { Container } from "inversify";

import { App } from "./app";

// Controllers
import { UserController } from "users/users.controller";

// Services
import { LoggerService } from "logger/logger.service";

// Utils
import { ExceptionFilter } from "errors/exception.filter";

// Types
import { TYPES } from "./bindingTypes";
import { ExceptionFilterInterface } from "./errors/exception.filter.interface";

import "reflect-metadata";

const appContainer = new Container();

appContainer.bind<App>(TYPES.APP).to(App);
appContainer.bind<LoggerService>(TYPES.LOGGER).to(LoggerService);
appContainer
  .bind<ExceptionFilterInterface>(TYPES.EXCEPTION_FILTER)
  .to(ExceptionFilter);
appContainer.bind<UserController>(TYPES.USER_CONTROLLER).to(UserController);
const app = appContainer.get<App>(TYPES.APP);

app.init();

export { app, appContainer };
