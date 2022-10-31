import express, { Express } from "express";
import { Server } from "http";

import { LoggerService } from "./logger/logger.service";

import userRouter from "./users/users";

export class App {
  app: Express;
  port: number;
  server: Server;
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;

    this.server = this.app.listen(this.port, () => {
      this.runServerLog();
    });
  }

  runServerLog() {
    this.logger.log(`listening server on http://localhost:${this.port}`);
  }

  useRoutes() {
    this.app.use("/users", userRouter);
  }

  public async init() {
    this.useRoutes();
  }
}
