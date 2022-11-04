import { Request, Response } from "express";

import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";

export interface UsersControllerInterface {
  login(req: Request<{}, {}, UserLoginDto>, res: Response): void;
  register(req: Request<{}, {}, UserRegisterDto>, res: Response): void;
}
