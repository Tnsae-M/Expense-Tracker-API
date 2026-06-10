import { catchAsync } from "../utils/catch.async";
import { verifyToken } from "../utils/token";
import { Request, Response, NextFunction } from "express";
import { appError } from "../utils/appError";
export async function protectedRoute(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let token: string | undefined;
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authorized, token missing!",
      });
    }
    const decodedLoad = await verifyToken(token);
    if (!decodedLoad) {
      return res.status(401).json({
        success: false,
        error: "Not authorized, invalid or expired token!",
      });
    }
    req.user = {
      tokenUserId: decodedLoad.userId,
      tokenEmail: decodedLoad.email,
    };
    next();
  } catch (er) {
    console.log("auth middleware error: ", er);
    return res.status(500).json({
      success: false,
      error: "Internal server auth error",
    });
  }
}
export const protectRoute = catchAsync(async (req: Request, res: Response) => {
  let token: string | undefined;
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  if (!token) {
    throw new appError("Not authorized. token missing!", 401);
  }
  const decodedLoad = await verifyToken(token);
  if (!decodedLoad) {
    throw new appError("Token expired!", 401);
  }
  req.user = {
    tokenUserId: decodedLoad.userId,
    tokenEmail: decodedLoad.email,
  };
});
