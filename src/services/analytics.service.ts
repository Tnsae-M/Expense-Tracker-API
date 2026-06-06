import { AnalyticsQuerySchema } from "../schemas/analytics.schema";
import { appError } from "../utils/appError";
import { prisma } from "../config/lib";
import { start } from "node:repl";
export const getMonthlyAnalytics = async function (
  filter: AnalyticsQuerySchema,
  userId: number,
) {
  let { month, year } = filter;
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
  const whereClause = {
    userId: userId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  };
  const [totalIncome, totalExpense] = await prisma.$transaction([
    prisma.income.aggregate({
      _sum: { amount: true },
      where: whereClause,
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: whereClause,
    }),
  ]);
  const monthlyIncome = Number(totalIncome._sum.amount);
  const monthlyExpense = Number(totalExpense._sum.amount);
  const remainingBalance = monthlyIncome - monthlyExpense;
  return {
    totalIncome: monthlyIncome,
    totalExpense: monthlyExpense,
    remaining_balance: remainingBalance,
  };
};
