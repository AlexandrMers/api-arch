import { Request, Response, NextFunction } from "express";

import { MiddlewareInterface } from "./middleware.interface";

export class AuthGuard implements MiddlewareInterface {
  execute(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
      return next();
    }

    res.status(401).send({
      message: "Пользователь не авторизован",
    });
  }
}
