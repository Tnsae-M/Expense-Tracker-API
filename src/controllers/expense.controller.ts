import { catchAsync } from "../utils/catch.async";
import { Request, Response } from "express";
import {
  createExpense,
  updateExpense,
  getExpense,
  deleteExpense,
} from "../services/expense.service";
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
    const id = req.user?.tokenUserId;
    const validFilters = expenseQuerySchema.parse(req.query);
    const expense = await getExpense(validFilters, id);
    res.status(200).json({
      success: true,
      message: "expense(s) found successfully.",
      result: expense.length,
      data: expense,
    });
  },
);
export const updateExpenseById = catchAsync(
  async (req: Request, res: Response) => {
    const expenseId = Number(req.params.id);
    if (Object.keys(req.body).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes detected, Expense remains unchanged",
      });
    }
    const updatedExpense = await updateExpense(req.body, expenseId);
    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  },
);
export const deleteExpenseById = catchAsync(
  async (req: Request, res: Response) => {
    const expenseId = Number(req.params.id);
    const deletedExp = await deleteExpense(expenseId);
    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      data: deletedExp,
    });
  },
);
