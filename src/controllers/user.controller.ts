import { appError } from "../utils/appError";
import { catchAsync } from "../utils/catch.async";
import { prisma } from "../config/lib";
import { Request, Response } from "express";
import { fetchProfile, updateUserProfile } from "../services/user.service";
import { updateProfileSchema } from "../schemas/profile.schema";
import { serializePrismaResult } from "../utils/prisma-serializer";
//profile routes
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userDataToken = req.user;
  if (!userDataToken) {
    throw new appError("user data not found in token", 400);
  }
  const userProfile = await fetchProfile(userDataToken.tokenUserId);
  return res.status(200).json({
    success: true,
    message: `welcome to profile page, ${userProfile?.username}`,
    data: serializePrismaResult(userProfile),
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
  const currentUser = await updateUserProfile(
    validatedData,
    userDataToken.tokenUserId,
  );
  return res.status(200).json({
    success: true,
    message: "profile updated successfully",
    profile: serializePrismaResult(currentUser),
  });
});
export { getProfile, updateProfile };
