import {
  newExpense,
  getExpenseByFilter,
} from "../controllers/expense.controller";
import { Router } from "express";
import { protectedRoute } from "../middleware/auth.guard";
const router = Router();

router.post("/", protectedRoute, newExpense);
// router.get("/user", protectedRoute, getAllExpense);
router.get("/", protectedRoute, getExpenseByFilter);

export default router;
