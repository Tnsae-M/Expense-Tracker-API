import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
const app = express();

app.use(express.json());

//defined routes
app.use("/api/auth", authRoutes);

//server status routes
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
