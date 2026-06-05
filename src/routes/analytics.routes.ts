import { getMonthlyIncomeController } from "../controllers/analytics.controller";
import { Router } from "express";
import { protectedRoute } from "../middleware/auth.guard";

const router = Router();

router.get("/summary", protectedRoute, getMonthlyIncomeController);

export default router;
