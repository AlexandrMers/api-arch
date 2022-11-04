import { Request, Response } from "express";
import "reflect-metadata";

import { BaseController } from "common/base.controller";

import { LoggerService } from "../logger/logger.service";
import { inject, injectable } from "inversify";

import { TYPES } from "bindingTypes";

import { UsersControllerInterface } from "./users.controller.interface";

// DTO
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";

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

  login(req: Request<{}, {}, UserLoginDto>, res: Response) {
    this.ok(res, "Login!");
  }

  async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response) {
    const newUser = new User(body.email, body.login);
    await newUser.setPassword(body.password);

    this.ok(res, newUser);
  }
}
