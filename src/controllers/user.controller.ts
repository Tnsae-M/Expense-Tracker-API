import { appError } from "../utils/appError";
import { catchAsync } from "../utils/catch.async";
import { prisma } from "../config/lib";
import { Request, Response } from "express";
// import { SafeUser } from "../services/auth.service";
//profile routes
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userDataToken = req.user;
  if (!req.body) {
    throw new appError("no data provided", 400);
  }
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
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userDataToken = req.user;
  if (!userDataToken) {
    throw new appError("user data not found in token", 400);
  }
  const currentUser = await prisma.user.update({
    where: { id: userDataToken.tokenUserId },
    data: {
      fullName: req.body.fullName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      monthlyBudget: req.body.monthlyBudget,
      currency: req.body.currency,
    },
  });
  // const { password: dbPassword, ...SafeUser } = currentUser;
  return res.status(200).json({
    success: true,
    message: "profile updated successfully",
    profile: currentUser,
  });
  /* Got no fallback mechanism for sending empty response after successfull update, also the above !req.body fallback is getting bypassed and a {} body returns the success response with all data of user.
   */
});
export { getProfile, updateProfile };
