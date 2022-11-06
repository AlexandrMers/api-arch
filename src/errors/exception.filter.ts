import { NextFunction, Request, Response } from "express";

// For DI
import { inject, injectable } from "inversify";
import "reflect-metadata";

// Services
import { LoggerService } from "logger/logger.service";

// Types
import { ExceptionFilterInterface } from "./exception.filter.interface";
import { TYPES } from "bindingTypes";
import { ConfigServiceInterface } from "config/config.service.interface";

import { HTTPError } from "./http-error.class";

@injectable()
export class ExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(TYPES.LOGGER) private logger: LoggerService,
    @inject(TYPES.CONFIG_SERVICE)
    private readonly configService: ConfigServiceInterface
  ) {}

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
