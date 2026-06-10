import { catchAsync } from "../utils/catch.async";
import { verifyToken } from "../utils/token";
import { Request, Response, NextFunction } from "express";
import { appError } from "../utils/appError";
export const protectedRoute = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
    next();
  },
);
