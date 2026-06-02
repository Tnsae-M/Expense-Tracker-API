import { ExpenseModel } from "../../prisma/generated/prisma/models/Expense";
import { appError } from "../utils/appError";
import { prisma } from "../config/lib";
import { expenseInputType, ExpenseQueryType } from "../schemas/expense.schema";
async function createExpense(data: expenseInputType): Promise<ExpenseModel> {
  if (!data) {
    throw new appError("missing expected field(s)!", 400);
  }
  const userId = data.userId;
  //changing checkUser by id to util?
  const checkUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!checkUser) {
    throw new appError("User not found!", 404);
  }
  const cateId = data.categoryId;
  const checkCategory = await prisma.category.findUnique({
    where: { id: cateId },
  });
  if (!checkCategory) {
    throw new appError("Category not found!", 404);
  }
  data.date = new Date(data.date);
  const newExpense = await prisma.expense.create({ data });
  return newExpense;
}
// async function getAllExpenses(
//   userId: number | undefined,
// ): Promise<ExpenseModel[]> {
//   const expenses = await prisma.expense.findMany({ where: { userId: userId } });
//   if (!expenses) {
//     throw new appError("no expense is found", 404);
//   }
//   return expenses;
// }
async function getExpense(filters: ExpenseQueryType): Promise<ExpenseModel[]> {
  const { id, title, userId, categoryId } = filters;
  const expenses = await prisma.expense.findMany({
    where: {
      id: id,
      userId: userId,
      categoryId: categoryId,
      title: title
        ? {
            contains: title,
            mode: "insensitive",
          }
        : undefined,
    },
    orderBy: { date: "desc" },
  });
  if (!expenses) {
    throw new appError("expense not found!", 404);
  }
  return expenses;
}
async function updateExpense(
  data: expenseInputType,
  id: number,
): Promise<ExpenseModel> {
  const checkExpense = await prisma.expense.findUnique({
    where: { id },
  });
  if (!checkExpense) {
    throw new appError("Expense not found!", 404);
  }
  data.date = new Date(data.date);
  const updatedExpense = await prisma.expense.update({
    where: { id },
    data,
  });
  return updatedExpense;
}
export { createExpense, getExpense, updateExpense };
