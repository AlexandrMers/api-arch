import express, { Express } from "express";
import { Server } from "http";

// Types
import { TYPES } from "./bindingTypes";
import { ConfigServiceInterface } from "config/config.service.interface";

// For DI
import { inject, injectable } from "inversify";
import "reflect-metadata";

// Controllers
import { UserController } from "users/users.controller";

// Services
import { LoggerService } from "logger/logger.service";
import { ExceptionFilter } from "errors/exception.filter";
import { PrismaService } from "./common/prisma.service";

@injectable()
export class App {
  app: Express;
  port: number;
  server: Server;

  constructor(
    @inject(TYPES.LOGGER) private logger: LoggerService,
    @inject(TYPES.EXCEPTION_FILTER) private exceptionFilter: ExceptionFilter,
    @inject(TYPES.USER_CONTROLLER) private userController: UserController,
    @inject(TYPES.CONFIG_SERVICE) private configService: ConfigServiceInterface,
    @inject(TYPES.PRISMA_SERVICE) private prismaService: PrismaService
  ) {
    this.app = express();
    this.port = Number(this.configService.get("PORT"));

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

  useMiddlewares() {
    this.app.use(express.json());
  }

  useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  async connectToDb() {
    await this.prismaService.connect();
  }

  public async init() {
    this.useMiddlewares();
    this.useRoutes();
    this.useExceptionFilters();

    await this.connectToDb();
  }
}
