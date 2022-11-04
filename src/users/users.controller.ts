import { Request, Response } from "express";

import { BaseController } from "common/base.controller";

import { LoggerService } from "../logger/logger.service";
import { inject, injectable } from "inversify";

import { TYPES } from "bindingTypes";

import { UsersControllerInterface } from "./users.controller.interface";

import "reflect-metadata";

@injectable()
export class UserController
  extends BaseController
  implements UsersControllerInterface
{
  constructor(@inject(TYPES.LOGGER) loggerService: LoggerService) {
    super(loggerService);
    loggerService.log(`Binding UserController:`);

    this.bindRoutes([
      {
        path: "/login",
        method: "post",
        func: this.login,
      },
      {
        path: "/register",
        method: "post",
        func: this.register,
      },
    ]);
  }

  login(req: Request, res: Response) {
    this.ok(res, "Login!");
  }

  register(req: Request, res: Response) {
    this.ok(res, "Register!");
  }
}
