import { getProfile } from "../controllers/user.controller";
import { Router } from "express";
import { protectedRoute } from "../middleware/auth.guard";

const router = Router();

//profile routes
router.get("/me", protectedRoute, getProfile);

export default router;
