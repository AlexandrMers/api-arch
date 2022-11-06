import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { ClassConstructor, plainToClass } from "class-transformer";

// For DI
import { injectable } from "inversify";
import "reflect-metadata";

import { LoggerInterface } from "logger/logger.interface";
import { MiddlewareInterface } from "./middleware.interface";

@injectable()
export class ValidateMiddleware implements MiddlewareInterface {
  constructor(
    private classToValidate: ClassConstructor<object>,
    private logger: LoggerInterface
  ) {
    this.logger.log("Bind ValidateMiddleware");
  }

  execute(req: Request, res: Response, next: NextFunction) {
    const instance = plainToClass(this.classToValidate, req.body);

    validate(instance).then((errors) => {
      if (errors.length > 0) {
        return res.status(422).send(errors);
      }
      next();
    });
  }
}
