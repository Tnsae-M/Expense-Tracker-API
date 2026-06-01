import {
  NewCategory,
  GetAllCategories,
  UpdateCategory,
  DeleteCategory,
} from "../controllers/category.controller";
import { Router } from "express";
import { protectedRoute } from "../middleware/auth.guard";
const router = Router();

router.post("/", protectedRoute, NewCategory);
router.get("/", protectedRoute, GetAllCategories); //does it need protected route?
router.patch("/:id", protectedRoute, UpdateCategory);
router.delete("/:id", protectedRoute, DeleteCategory);
export default router;
