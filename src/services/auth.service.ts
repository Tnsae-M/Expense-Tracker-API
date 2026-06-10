import { hashPassword, comparePassword } from "../utils/password";
import { prisma } from "../config/lib";
import type { UserModel } from "../../prisma/generated/prisma/models";
import { appError } from "../utils/appError";
import { SignUpSchemaType, SignInSchemaType } from "../schemas/user.schema";
export type SafeUser = Omit<UserModel, "password">;
//=================================================================
async function registerUser(data: SignUpSchemaType): Promise<SafeUser> {
  const { fullName, username, email, password, monthlyBudget, currency } = data;
  if (!fullName || !username || !email || !password || !monthlyBudget) {
    throw new appError("missing required field(s)!", 400);
  }
  const checkByEmail = await prisma.user.findFirst({
    where: {
      email: email.toLocaleLowerCase().trim(),
    },
  });
  const checkByUsername = await prisma.user.findFirst({
    where: { username: username.trim() },
  });
  if (checkByEmail) {
    throw new appError("User with this email already exists", 400);
  }
  if (checkByUsername) {
    throw new appError("User with this username already exists", 400);
  }
  if (data.password.length < 6) {
    throw new appError("password must be atleast 6 characters long.", 400);
  }
  const hashedPassword = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      fullName: fullName,
      email: email.toLocaleLowerCase().trim(),
      username: username.trim(),
      password: hashedPassword,
      monthlyBudget: Number(monthlyBudget),
      currency: currency || "ETB",
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
async function loginUser(data: SignInSchemaType): Promise<SafeUser> {
  const { emailOrUsername, password } = data;
  if (!emailOrUsername || !password) {
    throw new appError("missing username/email or password field", 400);
  }
  const checkUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername },
      ],
    },
  });
  if (!checkUser) {
    throw new appError("Invalid credentials!", 401);
  }
  const isPassValid = await comparePassword(password, checkUser.password);
  if (!isPassValid) {
    throw new appError("Incorrect password!", 401);
  }
  const { password: dbPassword, ...safeUser } = checkUser;
  return safeUser;
}
export { registerUser, loginUser };
