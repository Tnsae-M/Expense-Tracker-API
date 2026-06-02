import { newExpense, getAllExpense } from "../controllers/expense.controller";
import { Router } from "express";
import { protectedRoute } from "../middleware/auth.guard";
const router = Router();

router.post("/", protectedRoute, newExpense);
router.get("/", protectedRoute, getAllExpense);

export default router;
