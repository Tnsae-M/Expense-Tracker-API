import { newExpense } from "../controllers/expense.controller";
import { Router } from "express";
import { protectedRoute } from "../middleware/auth.guard";
const router = Router();

router.post("/", protectedRoute, newExpense);

export default router;
