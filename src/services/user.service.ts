import { appError } from "../utils/appError";
import { prisma } from "../config/lib";
import { UpdateProfileInput } from "../schemas/profile.schema";
import { hashPassword } from "../utils/password";
export async function fetchProfile(id: string) {
  const currentUser = await prisma.user.findUnique({
    where: { id: id },
    select: {
      fullName: true,
      username: true,
      email: true,
      monthlyBudget: true,
      currency: true,
    },
  });
  return currentUser;
}
export async function updateUserProfile(data: UpdateProfileInput, uid: string) {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }
  const currentUser = await prisma.user.update({
    where: { id: uid },
    data: data,
  });
  const { password: dbPassword, ...safeUser } = currentUser;
  return safeUser;
}
