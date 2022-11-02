import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

import { LoggerService } from "logger/logger.service";

import { ExceptionFilterInterface } from "./exception.filter.interface";
import { HTTPError } from "./http-error.class";

import { TYPES } from "../bindingTypes";

import "reflect-metadata";

@injectable()
export class ExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(TYPES.LOGGER) private logger: LoggerService) {}

  catch(
    err: Error | HTTPError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (err instanceof HTTPError) {
      this.logger.error(
        `[${err.context}] Ошибка ${err.statusCode} : ${err.message}`
      );
      res.status(err.statusCode).send({ error: err.message });
    } else {
      this.logger.error(err.message);
      res.status(500).send({ error: err.message });
    }
  }
}
