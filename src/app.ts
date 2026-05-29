import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import limiter from "./utils/rate.limiter";
import authRoutes from "./routes/auth.routes";
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors()); // or cors({ origin: "http://localhost:3000" }) for specific origin of frontend
app.use(limiter);
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
