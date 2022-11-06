import { inject, injectable } from "inversify";

import { PrismaClient } from "@prisma/client";

// Types
import { PrismaServiceInterface } from "./prisma.service.interface";
import { LoggerInterface } from "../logger/logger.interface";
import { TYPES } from "../bindingTypes";

@injectable()
export class PrismaService implements PrismaServiceInterface {
  client: PrismaClient;

  constructor(@inject(TYPES.LOGGER) private logger: LoggerInterface) {
    this.client = new PrismaClient();
  }

  async connect() {
    try {
      this.client.$connect();
      this.logger.log(`[${this.constructor.name}]: DB is connected`);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(
          `[${this.constructor.name}]: DB is not connected. Error ${e.message}`
        );
      }
    }
  }

  async disconnect() {
    this.client.$disconnect();
  }
}
