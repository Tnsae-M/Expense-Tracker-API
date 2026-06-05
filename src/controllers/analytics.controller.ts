import { getMonthlyIncome } from "../services/analytics.service";
import { Request, Response } from "express";
import { catchAsync } from "../utils/catch.async";
import { analyticsQuerySchema } from "../schemas/analytics.schema";

export const getMonthlyIncomeController = catchAsync(
  async (req: Request, res: Response) => {
    const uid = Number(req.user?.tokenUserId);
    const validatedFilter = analyticsQuerySchema.parse(req.query);
    const analytics = await getMonthlyIncome(validatedFilter, uid);
    res.status(201).json({
      success: true,
      message: "total income calculated successfully.",
      data: analytics,
    });
  },
);
