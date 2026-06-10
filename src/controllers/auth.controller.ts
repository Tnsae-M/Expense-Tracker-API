import { registerUser, loginUser } from "../services/auth.service";
import { Request, Response } from "express";
import { signInSchema, signUpSchema } from "../schemas/user.schema";
import { generateToken } from "../utils/token";
import { authReqLimiter } from "../utils/rate.limiter";
import { catchAsync } from "../utils/catch.async";
import dotenv from "dotenv";
dotenv.config();
export const signUp = catchAsync(async (req: Request, res: Response) => {
  const validRequestBody = signUpSchema.parse(req.body);
  const newUser = await registerUser(validRequestBody);
  const accessToken = await generateToken(newUser.id, newUser.email);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "Production",
    maxAge: 2 * 60 * 60 * 1000, //2hrs
  });
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const validBody = signInSchema.parse(req.body);
  const user = await loginUser(validBody);
  if (req.ip) {
    authReqLimiter.resetKey(req.ip);
  }
  const accessToken = await generateToken(user.id, user.email);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "Production",
    maxAge: 2 * 60 * 60 * 1000, //2hrs
  });
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: user,
  });
});
const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "Production",
    path: "/",
  });
  res.status(200).json({
    success: true,
    message: "your account has been logged out successfully",
  });
});

export { login, logout };
