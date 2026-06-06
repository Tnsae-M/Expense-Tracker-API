import { getMonthlyAnalytics } from "../services/analytics.service";
import { Request, Response } from "express";
import { catchAsync } from "../utils/catch.async";
import { analyticsQuerySchema } from "../schemas/analytics.schema";

export const getMonthlyAnalyticsController = catchAsync(
  async (req: Request, res: Response) => {
    const uid = Number(req.user?.tokenUserId);
    const validatedFilter = analyticsQuerySchema.parse(req.query);
    const analytics = await getMonthlyAnalytics(validatedFilter, uid);
    res.status(200).json({
      success: true,
      message: "Monthly analytics calculated successfully.",
      data: analytics,
    });
  },
);
