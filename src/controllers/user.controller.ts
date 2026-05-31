import { appError } from "../utils/appError";
import { catchAsync } from "../utils/catch.async";
import { prisma } from "../config/lib";
import { Request, Response } from "express";

//profile routes
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userDataToken = req.user;
  if (!userDataToken) {
    throw new appError("user data not found in token", 400);
  }
  const currentUser = await prisma.user.findUnique({
    where: { id: userDataToken.tokenUserId },
    select: {
      fullName: true,
      username: true,
      email: true,
      monthlyBudget: true,
      currency: true,
    },
  });
  return res.status(200).json({
    success: true,
    message: `welcome to profile page, ${currentUser?.username}`,
    data: currentUser,
  });
});
export { getProfile };
