import express, { Request, Response } from "express";

const userRouter = express.Router();

userRouter.post("/login", (req: Request, res: Response) => {
  res.send("Login!");
});

userRouter.post("/register", (req: Request, res: Response) => {
  res.send("Register!");
});

export default userRouter;
