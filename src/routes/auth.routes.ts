import { Router } from "express";
import { login, signUp, logout } from "../controllers/auth.controller";
import { protectedRoute } from "../middleware/auth.guard";
import { authReqLimiter } from "../utils/rate.limiter";
const router = Router();
//user auth routes
router.post("/register", authReqLimiter, signUp);
router.post("/login", authReqLimiter, login);
router.post("/logout", logout);
export default router;
