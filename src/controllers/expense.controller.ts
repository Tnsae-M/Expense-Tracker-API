import { catchAsync } from "../utils/catch.async";
import { Request, Response } from "express";
import { createExpense, getAllExpenses } from "../services/expense.service";

export const newExpense = catchAsync(async (req: Request, res: Response) => {
  const newExpense = await createExpense(req.body);
  res.status(200).json({
    success: true,
    message: "Expense created successfully",
    data: newExpense,
  });
});
export const getAllExpense = catchAsync(async (req: Request, res: Response) => {
  const expenses = await getAllExpenses();
  res.status(201).json({
    success: true,
    message: "expenses retrieved successfully.",
    data: expenses,
  });
});
