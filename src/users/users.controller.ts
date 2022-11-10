import { inject, injectable } from "inversify";
import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";

import { HTTPError } from "errors/http-error.class";
import { AuthGuard } from "common/auth.guard";

// Types
import { TYPES } from "bindingTypes";
import { UsersControllerInterface } from "./users.controller.interface";
import { ValidateMiddleware } from "common/validate.middleware";
import { ConfigServiceInterface } from "../config/config.service.interface";

// Controllers
import { BaseController } from "common/base.controller";

// Services
import { LoggerService } from "../logger/logger.service";
import { UsersService } from "./users.service";

// DTO
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";

// Models
import { UserModel } from "@prisma/client";

function signJwtPromisify(email: string, secret: string): Promise<string> {
  return new Promise((resolve, reject) => {
    sign(
      {
        email,
        iat: Math.floor(Date.now() / 1000),
      },
      secret,
      {
        algorithm: "HS256",
      },
      (error, encoded) => {
        if (error) {
          reject(error);
        }
        resolve(encoded as string);
      }
    );
  });
}

@injectable()
export class UserController
  extends BaseController
  implements UsersControllerInterface
{
  constructor(
    @inject(TYPES.LOGGER) private loggerService: LoggerService,
    @inject(TYPES.USER_SERVICE) private usersService: UsersService,
    @inject(TYPES.VALIDATOR_MIDDLEWARE)
    ValidatorMiddleware: typeof ValidateMiddleware,
    @inject(TYPES.CONFIG_SERVICE) private configService: ConfigServiceInterface
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
      {
        path: "/info",
        method: "get",
        func: this.userInfo,
        middlewares: [new AuthGuard()],
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

    const secretKey = this.configService.get("SECRET_JWT");
    const token = await this.signJWT(body.email, secretKey);

    this.ok(res, {
      token,
    });
  }

  async userInfo(req: Request<{}, {}, UserLoginDto>, res: Response) {
    const userInfo = await this.usersService.getUserInfo(req.user);

    this.ok(res, {
      email: userInfo?.email,
      id: userInfo?.id,
      name: userInfo?.name,
    });
  }

  async signJWT(email: string, secret: string) {
    return signJwtPromisify(email, secret);
  }
}
