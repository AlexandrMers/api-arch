import { Router, Response } from "express";

import { LoggerService } from "logger/logger.service";

import { IControllerRoute } from "./route.interface";

export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: LoggerService) {
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
