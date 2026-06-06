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
  const [totalIncome, totalExpense, categoryGroups, topSpendingCategory] =
    await prisma.$transaction([
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
      prisma.expense.groupBy({
        by: ["categoryId"],
        _sum: { amount: true },
        where: whereClause,
      }),
    ]);
  const monthlyIncome = Number(totalIncome._sum.amount);
  const monthlyExpense = Number(totalExpense._sum.amount);
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const categorySummary = categoryGroups.map((group) => ({
    category: categoryMap.get(group.categoryId) || "Unknown",
    totalSpent: Number(group._sum.amount || 0),
  }));
  categorySummary.sort((a, b) => b.totalSpent - a.totalSpent);
  const topSpending = topSpendingCategory.map((gr) => {
    return {
      name: categoryMap.get(gr.categoryId),
      totalSpent: Number(gr._sum.amount || 0),
    };
  });
  topSpending.sort((a, b) => b.totalSpent - a.totalSpent);
  const topSpendingSummary =
    topSpending.length > 0
      ? {
          name: topSpending[0].name,
          totalSpent: topSpending[0].totalSpent,
        }
      : null;
  const remainingBalance = monthlyIncome - monthlyExpense;
  return {
    totalIncome: monthlyIncome,
    totalExpense: monthlyExpense,
    remaining_balance: remainingBalance,
    top_spending_category: topSpendingSummary,
    categorySpending: categorySummary,
  };
};
