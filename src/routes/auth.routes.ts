import { Router } from "express";
import { login, signUp, logout } from "../controllers/auth.controller";
import { protectedRoute } from "../middleware/auth.guard";
import { authReqLimiter } from "../utils/rate.limiter";
const router = Router();
//user auth routes
router.post("/register", authReqLimiter, signUp);
router.post("/login", authReqLimiter, login);
router.post("/logout", logout);
//dashboard routes
router.get("/dashboard", protectedRoute, (req, res) => {
  let currentUser = {
    id: req.user?.tokenUserId,
    email: req.user?.tokenEmail,
  };
  res.json({
    message: `welcome to the dashboard,${currentUser.email}`,
    userId: currentUser.id,
  });
});
export default router;
