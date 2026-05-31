import { Router } from "express";
import {
  login,
  signUp,
  logout,
  getProfile,
} from "../controllers/auth.controller";
import { protectedRoute } from "../middleware/auth.guard";
const router = Router();
//user auth routes
router.post("/register", signUp);
router.post("/login", login);
router.post("/logout", logout);
//profile routes
router.get("/profile", protectedRoute, getProfile);
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
