import { Request, Response } from "express";

export interface UsersControllerInterface {
  login(req: Request, res: Response): void;
  register(req: Request, res: Response): void;
}
