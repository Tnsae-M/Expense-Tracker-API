import { catchAsync } from "../utils/catch.async";
import { Request, Response } from "express";
import { addIncome } from "../services/income.service";

const addIncomeController = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.tokenUserId;
  const income = await addIncome(req.body, id);
  res.status(201).json({
    success: true,
    data: income,
  });
});
export { addIncomeController };
