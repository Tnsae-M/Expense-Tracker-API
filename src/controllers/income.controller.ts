import { catchAsync } from "../utils/catch.async";
import { Request, Response } from "express";
import {
  addIncome,
  getIncomeByFilter,
  updateIncome,
} from "../services/income.service";
import { incomeQuerySchema } from "../schemas/income.schema";

const addIncomeController = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.tokenUserId;
  const income = await addIncome(req.body, id);
  res.status(201).json({
    success: true,
    data: income,
  });
});
const getIncomeController = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.tokenUserId;
  const validFilter = incomeQuerySchema.parse(req.query);
  const incomes = await getIncomeByFilter(validFilter, id);
  res.status(200).json({
    success: true,
    message: "income(s) retrieved successfully",
    result: incomes.length,
    data: incomes,
  });
});
const updateIncomeController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    if (Object.keys(req.body).length === 0) {
      return res.status(201).json({
        success: true,
        message: "No changes to update",
      });
    }
    const updatedIncome = await updateIncome(req.body, Number(id));
    res.status(200).json({
      success: true,
      message: "income updated successfully",
      data: updatedIncome,
    });
  },
);
export { addIncomeController, getIncomeController, updateIncomeController };
