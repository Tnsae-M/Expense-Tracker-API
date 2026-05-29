import { registerUser, loginUser } from "../services/auth.service";
import { Request, Response } from "express";

async function signUp(req: Request, res: Response) {
  try {
    const { fullName, username, email, password, monthlyBudget, currency } =
      req.body;
    if (!fullName || !username || !email || !password || !monthlyBudget) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }
    const newUser = await registerUser({
      fullName,
      username,
      email,
      password,
      monthlyBudget,
      currency,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error: any) {
    //known validation error
    if (error.message.includes("already exists")) {
      res.status(400).json({
        error: error.message,
      });
      return;
    }
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

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
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error: any) {
    if (
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
  }
}
export { signUp, login };
