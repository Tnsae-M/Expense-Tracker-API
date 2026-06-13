import {
  newCategory,
  deleteCategories,
  getAllCategory,
  updateCategories,
} from "../controllers/category.controller";
import { Router } from "express";
import { protectedRoute } from "../middleware/auth.guard";
const router = Router();

router.post("/", protectedRoute, newCategory);
router.get("/", protectedRoute, getAllCategory); //does it need protected route?
router.patch("/:id", protectedRoute, updateCategories);
router.delete("/:id", protectedRoute, deleteCategories);
export default router;
