import { appError } from "../utils/appError";
import { catchAsync } from "../utils/catch.async";
import { prisma } from "../config/lib";
import { Request, Response } from "express";
import { hashPassword } from "../utils/password";
// import { SafeUser } from "../services/auth.service";
import {
  UpdateProfileInput,
  updateProfileSchema,
} from "../schemas/profile.schema";
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

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userDataToken = req.user;
  if (!userDataToken) {
    throw new appError("user data not found in token", 400);
  }
  const validatedData = updateProfileSchema.parse(req.body);
  if (Object.keys(validatedData).length === 0) {
    return res.status(200).json({
      success: true,
      message: "No changes detected, profile remains unchanged",
    });
  }
  if (validatedData.password) {
    validatedData.password = await hashPassword(validatedData.password);
  }
  const currentUser = await prisma.user.update({
    where: { id: userDataToken.tokenUserId },
    data: validatedData,
  });
  const { password: dbPassword, ...SafeUser } = currentUser;
  return res.status(200).json({
    success: true,
    message: "profile updated successfully",
    profile: SafeUser,
  });
});
export { getProfile, updateProfile };
