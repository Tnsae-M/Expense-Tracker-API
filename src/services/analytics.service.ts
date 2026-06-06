import {
  AnalyticsQuerySchema,
  analyticsQuerySchema,
} from "../schemas/analytics.schema";
import { appError } from "../utils/appError";
import { prisma } from "../config/lib";
import { undefined } from "zod";
export const getMonthlyAnalytics = async function (
  filter: AnalyticsQuerySchema,
  userId: number,
) {
  let { month, year, category } = filter;
  month = Number(month);
  year = Number(year);
  const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  //   console.log(
  //     "SEARCHING BETWEEN:",
  //     startDate.toISOString(),
  //     "AND",
  //     endDate.toISOString(),
  //   );
  const categories = await prisma.category.findMany();
  let targetId: number | undefined;
  if (category) {
    const matchCate = categories.find(
      (c) => c.name.toLocaleLowerCase() === category.toLocaleLowerCase(),
    );
    targetId = matchCate ? matchCate.id : -1;
  }
  const whereClause = {
    userId: userId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  };
  const [totalIncome, totalExpense, categoryGroups] = await prisma.$transaction(
    [
      prisma.income.aggregate({
        _sum: { amount: true },
        where: whereClause,
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: whereClause,
      }),
      prisma.expense.groupBy({
        by: ["categoryId"],
        _sum: { amount: true },
        where: { ...whereClause, categoryId: targetId },
      }),
    ],
  );
  const monthlyIncome = Number(totalIncome._sum.amount);
  const monthlyExpense = Number(totalExpense._sum.amount);
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const categorySummary = categoryGroups.map((group) => ({
    category: categoryMap.get(group.categoryId) || "Unknown",
    totalSpent: Number(group._sum.amount || 0),
  }));
  const remainingBalance = monthlyIncome - monthlyExpense;
  return {
    totalIncome: monthlyIncome,
    totalExpense: monthlyExpense,
    remaining_balance: remainingBalance,
    categorySpending: categorySummary,
  };
};
