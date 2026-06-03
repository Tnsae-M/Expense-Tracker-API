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
//--------
async function getIncomeByFilter(
  filter: IncomeQueryType,
  uid: number | undefined,
): Promise<IncomeModel[]> {
  //handle using userId as a filter later.
  const { id, source, description } = filter;
  const authUid = Number(uid);
  const incomes = await prisma.income.findMany({
    where: {
      id: id,
      userId: authUid,
      source: source
        ? {
            contains: source,
            mode: "insensitive",
          }
        : undefined,
      description: description
        ? {
            contains: description,
            mode: "insensitive",
          }
        : undefined,
    },
    orderBy: { date: "desc" },
  });
  return incomes;
}
async function updateIncome(
  data: Partial<incomeInputType>,
  id: number,
  uid: number,
): Promise<IncomeModel> {
  const income = await prisma.income.findUnique({
    where: {
      id: id,
      userId: uid,
    },
  });
  if (!income) {
    throw new appError("income to update not found", 404);
  }
  if (data.date) {
    data.date = new Date(data.date);
  }
  const updatedIncome = await prisma.income.update({
    where: {
      id: id,
    },
    data: data,
  });
  return updatedIncome;
}
async function deleteIncome(id: number, userId: number): Promise<IncomeModel> {
  const income = await prisma.income.findUnique({
    where: { id: id, userId: userId },
  });
  if (!income) {
    throw new appError("income to delete not found!", 404);
  }
  const deleteIncome = await prisma.income.delete({
    where: { id: id },
  });
  return deleteIncome;
}
export { addIncome, getIncomeByFilter, updateIncome, deleteIncome };
