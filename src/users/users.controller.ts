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

    this.bindRoutes([
      {
        path: "/login",
        method: "post",
        func: this.login,
        middlewares: [],
      },
      {
        path: "/register",
        method: "post",
        func: this.register,
        middlewares: [userRegisterValidator],
      },
    ]);
  }

  login(req: Request<{}, {}, UserLoginDto>, res: Response) {
    this.ok(res, "Login!");
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
  }
}
