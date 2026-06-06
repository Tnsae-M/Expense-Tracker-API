import { getMonthlyAnalyticsController } from "../controllers/analytics.controller";
import { Router } from "express";
import { protectedRoute } from "../middleware/auth.guard";

const router = Router();

router.get("/summary", protectedRoute, getMonthlyAnalyticsController);

export default router;
