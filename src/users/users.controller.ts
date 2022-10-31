import { NextFunction, Request, Response } from "express";

import { BaseController } from "../common/base.controller";

import { LoggerService } from "../logger/logger.service";
import { HTTPError } from "errors/http-error.class";

export class UserController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);

    logger.log(`Binding UserController:`);

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
