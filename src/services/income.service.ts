import { prisma } from "../config/lib";
import { appError } from "../utils/appError";
import { incomeInputType, IncomeQueryType } from "../schemas/income.schema";
import { IncomeModel } from "../../prisma/generated/prisma/models";

async function addIncome(
  income: incomeInputType,
  userId: number | undefined,
): Promise<IncomeModel> {
  if (!income || Object.keys(income).length === 0) {
    throw new appError("missing required fields", 400);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new appError("User not found", 404);
  }
  income.userId = Number(userId);
  if (income.date) {
    income.date = new Date(income.date);
  }
  const newIncome = await prisma.income.create({
    data: income,
  });
  return newIncome;
}
export { addIncome };
