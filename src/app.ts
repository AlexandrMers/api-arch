import express, { Express } from "express";
import { Server } from "http";

import { ExceptionFilter } from "errors/exception.filter";

import { LoggerService } from "logger/logger.service";

import { UserController } from "users/users.controller";
import { inject, injectable } from "inversify";
import { TYPES } from "./bindingTypes";

import "reflect-metadata";

@injectable()
export class App {
  app: Express;
  port: number;
  server: Server;

  constructor(
    @inject(TYPES.LOGGER) private logger: LoggerService,
    @inject(TYPES.EXCEPTION_FILTER) private exceptionFilter: ExceptionFilter,
    @inject(TYPES.USER_CONTROLLER) private userController: UserController
  ) {
    this.app = express();
    this.port = 8000;

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
