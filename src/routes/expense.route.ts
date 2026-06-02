import {
  newExpense,
  getExpenseByFilter,
  updateExpenseById,
  deleteExpenseById,
} from "../controllers/expense.controller";
import { Router } from "express";
import { protectedRoute } from "../middleware/auth.guard";
const router = Router();

router.post("/", protectedRoute, newExpense);
// router.get("/user", protectedRoute, getAllExpense);
router.get("/", protectedRoute, getExpenseByFilter);
router.patch("/:id", protectedRoute, updateExpenseById);
router.delete("/:id", protectedRoute, deleteExpenseById);

export default router;
