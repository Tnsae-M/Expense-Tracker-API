import { ExpenseModel } from "../../prisma/generated/prisma/models/Expense";
import { appError } from "../utils/appError";
import { prisma } from "../config/lib";
import {
  expenseInputType,
  ExpenseQueryType,
  expenseUpdateType,
} from "../schemas/expense.schema";
async function createExpense(
  data: expenseInputType,
  uid: string,
): Promise<ExpenseModel> {
  if (!data) {
    throw new appError("missing expected field(s)!", 400);
  }
  //changing checkUser by id to util?
  const checkUser = await prisma.user.findUnique({
    where: {
      id: uid,
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
  data.userId = uid;
  const newExpense = await prisma.expense.create({ data });
  return newExpense;
}
async function getExpense(filters: ExpenseQueryType, uid: string | undefined) {
  const {
    id,
    search,
    category,
    limit,
    page,
    endDate,
    startDate,
    maxAmount,
    minAmount,
  } = filters;
  const take = Number(limit);
  let skip = (Number(page) - 1) * take;
  if (skip <= 0) {
    skip = 0;
  }

  //define where clause for reuse in prisma trx
  const whereCondition = {
    id: id,
    userId: uid,
    category: category
      ? {
          name: { equals: category, mode: "insensitive" as const },
        }
      : undefined,
    title: search
      ? {
          contains: search,
          mode: "insensitive" as const,
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
  };
  const [expenses, pageRecords] = await prisma.$transaction([
    prisma.expense.findMany({
      where: whereCondition,
      skip: skip,
      take: take,
      orderBy: { date: "desc" },
    }),
    prisma.expense.count({ where: whereCondition }),
  ]);

  return { expenses, pageRecords };
}
async function updateExpense(
  data: expenseUpdateType,
  id: number,
  uid: string,
): Promise<ExpenseModel> {
  //user id must not be updated since only logged in user can update his expense only and not transfer the expense to someone else.
  const checkExpense = await prisma.expense.findUnique({
    where: { id: id, userId: uid },
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
  const updatedExpense = await prisma.expense.update({
    where: { id: id, userId: uid },
    data,
  });
  return updatedExpense;
}

async function deleteExpense(id: number, uid: string): Promise<ExpenseModel> {
  const checkExpense = await prisma.expense.findUnique({
    where: { id: id, userId: uid },
  });
  if (!checkExpense) {
    throw new appError("Expense to delete not found!", 404);
  }
  const deletedExpense = await prisma.expense.delete({
    where: { id: id, userId: uid },
  });
  return deletedExpense;
}
export { createExpense, getExpense, updateExpense, deleteExpense };
