import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is running",
  });
});
app.get("/start", (req: Request, res: Response) => {
  res.status(200).json({
    message: "welcome to student expense tracker API",
  });
});
export default app;
