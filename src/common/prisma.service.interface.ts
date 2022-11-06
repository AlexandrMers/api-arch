import { PrismaClient } from "@prisma/client";

export interface PrismaServiceInterface {
  client: PrismaClient;

  connect(): Promise<void>;

  disconnect(): Promise<void>;
}
