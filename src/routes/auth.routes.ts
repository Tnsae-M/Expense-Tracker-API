import { Router } from "express";
import { login, signUp, logout } from "../controllers/auth.controller";
const router = Router();

router.post("/register", signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;
