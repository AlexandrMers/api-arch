import { App } from "./app";

import { LoggerService } from "logger/logger.service";
import { ExceptionFilter } from "errors/exception.filter";

async function bootstrap() {
  const logger = new LoggerService();
  const exceptionFilter = new ExceptionFilter(logger);

  const app = new App(logger, exceptionFilter);
  await app.init();
}

bootstrap();
