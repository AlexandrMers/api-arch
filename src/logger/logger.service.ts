import { Logger } from "tslog";
import { injectable } from "inversify";

import { LoggerInterface } from "./logger.interface";

import "reflect-metadata";

@injectable()
export class LoggerService implements LoggerInterface {
  public logger: Logger;

  constructor() {
    this.logger = new Logger({
      displayInstanceName: false,
      displayLoggerName: false,
      displayFilePath: "hidden",
      displayFunctionName: false,
    });
  }

  log(...args: unknown[]) {
    this.logger.info(...args);
  }

  error(...args: unknown[]) {
    this.logger.error(...args);
  }

  warn(...args: unknown[]) {
    this.logger.error(...args);
  }
}
