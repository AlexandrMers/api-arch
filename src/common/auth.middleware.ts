import { NextFunction, Request, Response } from "express";

import { MiddlewareInterface } from "./middleware.interface";
import { JwtPayload, verify } from "jsonwebtoken";

function extractTokenFromHeaders(bearerToken: string) {
  return bearerToken.split(" ")[1];
}

export class AuthMiddleware implements MiddlewareInterface {
  constructor(private secret: string) {}

  execute(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = extractTokenFromHeaders(req.headers.authorization);

      return verify(token, this.secret, (error, decoded) => {
        if (decoded && typeof decoded !== "string") {
          req.user = decoded.email;
        }
        next();
      });
    }
    next();
  }
}
