import { Response, Router } from "express";
import { injectable } from "inversify";

import { IControllerRoute } from "./route.interface";

import { LoggerInterface } from "../logger/logger.interface";

import "reflect-metadata";

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: LoggerInterface) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  send<T>(res: Response, code: number, message: T) {
    return res.type("application/json").status(code).send(message);
  }

  ok<T>(res: Response, message: T) {
    return this.send(res, 200, message);
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    routes.forEach((route) => {
      this.logger.log(`[${route.method}]: ${route.path}`);

      const handler = route.func.bind(this);
      this.router[route.method](route.path, handler);
    });
  }
}
