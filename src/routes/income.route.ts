import { addIncomeController } from "../controllers/income.controller";
import { Router } from "express";
import { protectedRoute } from "../middleware/auth.guard";
const router = Router();

router.post("/", protectedRoute, addIncomeController);
export default router;
