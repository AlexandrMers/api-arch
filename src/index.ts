import express, { Request, Response } from "express";

// Routes
import userRouter from "./routes/users";

const port = 8080;

const app = express();

app.use("/users", userRouter);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Привет");
});

app.listen(port, () => {
  console.log(`listening server on http://localhost:${port}`);
});
