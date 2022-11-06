import { inject, injectable } from "inversify";
import "reflect-metadata";

import { config, DotenvParseOutput } from "dotenv";

// Types
import { TYPES } from "bindingTypes";
import { ConfigServiceInterface } from "./config.service.interface";
import { LoggerInterface } from "logger/logger.interface";

const ERROR_WITH_ENV = `Не удалось прочитать файл .env или он отсутствует`;

@injectable()
export class ConfigService implements ConfigServiceInterface {
  private readonly config: DotenvParseOutput;

  constructor(
    @inject(TYPES.LOGGER) private readonly loggerService: LoggerInterface
  ) {
    const result = config();

    if (result.error) {
      this.loggerService.error(`[${this.constructor.name}]: ${ERROR_WITH_ENV}`);
      return;
    }

    this.config = result.parsed as DotenvParseOutput;
    this.loggerService.log(
      `[${this.constructor.name}]: Конфигурация .env загружена`
    );
  }

  get(key: string): string {
    return this.config[key];
  }
}
