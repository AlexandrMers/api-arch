import { inject, injectable } from "inversify";
import "reflect-metadata";
import { NextFunction, Request, Response } from "express";

import { HTTPError } from "errors/http-error.class";

// Types
import { TYPES } from "bindingTypes";
import { UsersControllerInterface } from "./users.controller.interface";
import { ValidateMiddleware } from "common/validate.middleware";

// Controllers
import { BaseController } from "common/base.controller";

// Services
import { LoggerService } from "../logger/logger.service";
import { UsersService } from "./users.service";

// DTO
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { UserModel } from "@prisma/client";

@injectable()
export class UserController
  extends BaseController
  implements UsersControllerInterface
{
  constructor(
    @inject(TYPES.LOGGER) private loggerService: LoggerService,
    @inject(TYPES.USER_SERVICE) private usersService: UsersService,
    @inject(TYPES.VALIDATOR_MIDDLEWARE)
    ValidatorMiddleware: typeof ValidateMiddleware
  ) {
    super(loggerService);
    this.loggerService.log(`Binding UserController:`);

    const userRegisterValidator = new ValidatorMiddleware(
      UserRegisterDto,
      loggerService
    );

    const userLoginValidator = new ValidatorMiddleware(
      UserLoginDto,
      loggerService
    );

    this.bindRoutes([
      {
        path: "/login",
        method: "post",
        func: this.login,
        middlewares: [userLoginValidator],
      },
      {
        path: "/register",
        method: "post",
        func: this.register,
        middlewares: [userRegisterValidator],
      },
    ]);
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ) {
    const newUser = await this.usersService.createUser(body);

    if (!newUser) {
      return next(
        new HTTPError(422, "Пользователь с таким логином уже существует!", this)
      );
    }

    this.ok<{ email: UserModel["email"]; id: UserModel["id"] }>(res, {
      id: newUser.id,
      email: newUser.email,
    });
  }

  async login(
    { body }: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction
  ) {
    const isExistUser = await this.usersService.validateUser(body);

    if (!isExistUser) {
      return next(new HTTPError(422, "Неверные логин или пароль!"));
    }

    this.ok(res, {
      email: body.email,
    });
  }
}
