import { NewCategory } from "../controllers/category.controller";
import { Router } from "express";
import { protectedRoute } from "../middleware/auth.guard";
const router = Router();

router.post("/", protectedRoute, NewCategory);
export default router;
