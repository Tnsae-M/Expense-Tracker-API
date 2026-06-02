import { ExpenseModel } from "../../prisma/generated/prisma/models/Expense";
import { appError } from "../utils/appError";
import { prisma } from "../config/lib";
import { expenseInputType } from "../schemas/expense.schema";
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
async function getAllExpenses(): Promise<ExpenseModel[]> {
  const expenses = await prisma.expense.findMany();
  if (!expenses) {
    throw new appError("no expense is found", 404);
  }
  return expenses;
}
export { createExpense, getAllExpenses };
