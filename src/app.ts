import express, { Express } from "express";
import { Server } from "http";

import userRouter from "./routes/users";

export class App {
  app: Express;
  port: number;
  server: Server;

  constructor() {
    this.app = express();
    this.port = 8000;

    this.server = this.app.listen(this.port, () => {
      this.runServerLog();
    });
  }

  runServerLog() {
    console.log(`listening server on http://localhost:${this.port}`);
  }

  useRoutes() {
    this.app.use("/users", userRouter);
  }

  public async init() {
    this.useRoutes();
  }
}
