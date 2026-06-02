import { catchAsync } from "../utils/catch.async";
import { Request, Response } from "express";
import { createExpense, getExpense } from "../services/expense.service";
import { expenseQuerySchema } from "../schemas/expense.schema";
export const newExpense = catchAsync(async (req: Request, res: Response) => {
  const newExpense = await createExpense(req.body);
  res.status(200).json({
    success: true,
    message: "Expense created successfully",
    data: newExpense,
  });
});
// export const getAllExpense = catchAsync(async (req: Request, res: Response) => {
//   const id = req.user?.tokenUserId;
//   const expenses = await getAllExpenses(id);
//   res.status(201).json({
//     success: true,
//     message: "expenses retrieved successfully.",
//     data: expenses,
//   });
// });
export const getExpenseByFilter = catchAsync(
  async (req: Request, res: Response) => {
    const validFilters = expenseQuerySchema.parse(req.query);
    const expense = await getExpense(validFilters);
    res.status(200).json({
      success: true,
      message: "expense(s) found successfully.",
      result: expense.length,
      data: expense,
    });
  },
);
