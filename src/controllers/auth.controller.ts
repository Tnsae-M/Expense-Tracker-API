import { registerUser, loginUser } from "../services/auth.service";
import { Request, Response } from "express";
import { generateToken } from "../utils/token";
import { catchAsync } from "../utils/catch.async";
import { appError } from "../utils/appError";
export const signUp = catchAsync(async (req: Request, res: Response) => {
  const newUser = await registerUser(req.body);
  const accessToken = await generateToken(newUser.id, newUser.email);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 2 * 60 * 60 * 1000, //2hrs
  });
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const user = await loginUser(req.body);
  const accessToken = await generateToken(user.id, user.email);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
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
    path: "/",
  });
  res.status(200).json({
    success: true,
    message: "your account has been logged out successfully",
  });
});
export { login, logout };
