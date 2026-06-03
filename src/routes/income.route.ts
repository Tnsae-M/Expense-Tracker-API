import {
  addIncomeController,
  getIncomeController,
  updateIncomeController,
  deleteIncomeController,
} from "../controllers/income.controller";
import { Router } from "express";
import { protectedRoute } from "../middleware/auth.guard";
const router = Router();

router.post("/", protectedRoute, addIncomeController);
router.get("/", protectedRoute, getIncomeController);
router.patch("/:id", protectedRoute, updateIncomeController);
router.delete("/:id", protectedRoute, deleteIncomeController);
export default router;
