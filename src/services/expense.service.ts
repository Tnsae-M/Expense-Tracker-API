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
async function getExpense(
  filters: ExpenseQueryType,
  uid: number | undefined,
): Promise<ExpenseModel[]> {
  const {
    id,
    title,
    category,
    limit,
    page,
    endDate,
    startDate,
    maxAmount,
    minAmount,
  } = filters;
  const take = Number(limit);
  let skip = Number(page) - 1 * take;
  if (skip <= 0) {
    skip = 0;
  }
  const authUid = Number(uid);
  const expenses = await prisma.expense.findMany({
    skip: skip,
    take: take,
    where: {
      id: id,
      userId: authUid,
      category: category
        ? {
            name: { equals: category, mode: "insensitive" },
          }
        : undefined,
      title: title
        ? {
            contains: title,
            mode: "insensitive",
          }
        : undefined,
      date:
        startDate || endDate
          ? {
              gte: startDate ? new Date(startDate) : undefined,
              //the endDate doesn't filter by exact date due to timezoned date input
              lte: endDate ? new Date(endDate) : undefined,
            }
          : undefined,
      amount:
        minAmount || maxAmount
          ? {
              gte: minAmount,
              lte: maxAmount,
            }
          : undefined,
    },
    orderBy: { date: "desc" },
  });
  // if (!expenses) {
  //   throw new appError("expense not found!", 404);
  // }
  return expenses;
}
async function updateExpense(
  data: expenseInputType,
  id: number,
): Promise<ExpenseModel> {
  //user id must not be updated since only logged in user can update his expense only and not transfer the expense to someone else.
  const checkExpense = await prisma.expense.findUnique({
    where: { id },
  });
  if (!checkExpense) {
    throw new appError("Expense not found!", 404);
  }
  if (data.categoryId || data.userId) {
    if (data.userId) {
      const checkUser = await prisma.user.findUnique({
        where: { id: data.userId },
      });
      if (!checkUser) {
        throw new appError("the user to update to is not found", 404);
      }
    } else {
      const checkCategory = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!checkCategory) {
        throw new appError("the category to update to is not found", 404);
      }
    }
  }

  if (data.date) {
    data.date = new Date(data.date);
  }

  console.log(data.date);
  const updatedExpense = await prisma.expense.update({
    where: { id },
    data,
  });
  return updatedExpense;
}

async function deleteExpense(id: number): Promise<ExpenseModel> {
  const checkExpense = await prisma.expense.findUnique({
    where: { id },
  });
  if (!checkExpense) {
    throw new appError("Expense to delete not found!", 404);
  }
  const deletedExpense = await prisma.expense.delete({
    where: { id },
  });
  return deletedExpense;
}
export { createExpense, getExpense, updateExpense, deleteExpense };
