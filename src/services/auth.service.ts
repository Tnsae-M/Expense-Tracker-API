import { hashPassword, comparePassword } from "../utils/password";
import { prisma } from "../config/lib";
import type { UserModel } from "../../prisma/generated/prisma/models";
import { signUpDto } from "../dtos/user.dto";
export type SafeUser = Omit<UserModel, "password">;

async function registerUser(data: signUpDto): Promise<SafeUser> {
  const checkByEmail = await prisma.user.findFirst({
    where: {
      email: data.email.toLowerCase(),
    },
  });
  const checkByUsername = await prisma.user.findFirst({
    where: { username: data.username },
  });
  if (checkByEmail) {
    throw new Error("User with this email already exists");
  }
  if (checkByUsername) {
    throw new Error("User with this username already exists");
  }
  const hashedPassword = await hashPassword(data.password);
  const newUser = prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      username: data.username,
      password: hashedPassword,
      monthlyBudget: parseFloat(data.monthlyBudget.toString()),
      currency: data.currency || "ETB",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      username: true,
      monthlyBudget: true,
      currency: true,
      createdAt: true,
    },
  });
  return newUser;
}
//===================================================================
async function loginUser(data: {
  emailOrUsername: string;
  password: string;
}): Promise<SafeUser> {
  const checkUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.emailOrUsername.toLowerCase() },
        { username: data.emailOrUsername },
      ],
    },
  });
  if (!checkUser) {
    throw new Error("Invalid credentials!");
  }
  const isPassValid = await comparePassword(data.password, checkUser.password);
  if (!isPassValid) {
    throw new Error("Incorrect password!");
  }
  const { password, ...safeUser } = checkUser;
  return safeUser;
}
export { registerUser, loginUser };
