import { NextFunction, Request, Response } from "express";

import { LoggerService } from "logger/logger.service";

import { ExceptionFilterInterface } from "./exception.filter.interface";
import { HTTPError } from "./http-error.class";

export class ExceptionFilter implements ExceptionFilterInterface {
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

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
