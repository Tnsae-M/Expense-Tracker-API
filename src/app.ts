import express, { Request, Response } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import limiter from "./utils/rate.limiter";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import categoryRoutes from "./routes/category.routes";
import expenseRoutes from "./routes/expense.route";
import { globalErrorHandler } from "./middleware/error.guard";
import { appError } from "./utils/appError";
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors()); // or cors({ origin: "http://localhost:3000" }) for specific origin of frontend
app.use(limiter);
app.use(cookieParser());
//defined routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);
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
app.use((req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
export default app;
