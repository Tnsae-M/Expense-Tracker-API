import { AnalyticsQuerySchema } from "../schemas/analytics.schema";
import { appError } from "../utils/appError";
import { prisma } from "../config/lib";
export const getMonthlyIncome = async function (
  filter: AnalyticsQuerySchema,
  userId: number,
) {
  //   const checkUser = await prisma.user.findUnique({
  //     where: { id: userId },
  //   });
  //   if (!checkUser) {
  //     throw new appError("User not found! please log in and try again", 404);
  //   }
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
  const aggregation = await prisma.income.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      userId: userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  return {
    totalIncome: aggregation._sum.amount ? Number(aggregation._sum.amount) : 0,
  };
};
