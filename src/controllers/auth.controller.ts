import { registerUser, loginUser } from "../services/auth.service";
import { Request, Response } from "express";
import { generateToken } from "../utils/token";
import { catchAsync } from "../utils/catch.async";
export const signUp = catchAsync(async (req: Request, res: Response) => {
  const { fullName, email, username, password, monthlyBudget, currency } =
    req.body;
  const newUser = await registerUser({
    fullName,
    email,
    password,
    username,
    monthlyBudget,
    currency,
  });
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

async function login(req: Request, res: Response) {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      res.status(400).json({
        success: false,
        message: "Email/Username and password are required",
      });
      return;
    }
    const user = await loginUser({ emailOrUsername, password });
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
  } catch (error: any) {
    if (
      //the expected invalid credential error is not showing up when testing!
      error.message.includes("Invalid credentials") ||
      error.message.includes("Incorrect password")
    ) {
      res.status(401).json({
        error: error.message,
      });
      return;
    }
    res.status(500).json({
      error: "Internal server error",
    });
    console.log(error.message);
  }
}
async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({
      success: true,
      message: "your account has been logged out successfully",
    });
  } catch (er) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
}
export { login, logout };
