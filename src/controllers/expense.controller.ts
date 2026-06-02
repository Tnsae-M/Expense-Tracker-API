import { catchAsync } from "../utils/catch.async";
import { Request, Response } from "express";
import { createExpense } from "../services/expense.service";

export const newExpense = catchAsync(async (req: Request, res: Response) => {
  const newExpense = await createExpense(req.body);
  res.status(200).json({
    success: true,
    message: "Expense created successfully",
    data: newExpense,
  });
});
