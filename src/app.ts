import express, { Express } from "express";
import { Server } from "http";

import { ExceptionFilter } from "errors/exception.filter";

import { LoggerService } from "logger/logger.service";

import { UserController } from "users/users.controller";

export class App {
  app: Express;
  port: number;
  server: Server;
  logger: LoggerService;
  userController: UserController;
  exceptionFilter: ExceptionFilter;

  constructor(logger: LoggerService, exceptionFilter: ExceptionFilter) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
    this.exceptionFilter = exceptionFilter;

    this.userController = new UserController(logger);

    this.server = this.app.listen(this.port, () => {
      this.runServerLog();
    });
  }

  runServerLog() {
    this.logger.log(`listening server on http://localhost:${this.port}`);
  }

  useExceptionFilters() {
    this.app.use(this.exceptionFilter.catch.bind(this));
  }

  useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  public async init() {
    this.useRoutes();
    this.useExceptionFilters();
  }
}
