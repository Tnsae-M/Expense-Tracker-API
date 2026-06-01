import { Request, Response } from "express";
import { createCategory } from "../services/category.service";
import { catchAsync } from "../utils/catch.async";

export const NewCategory = catchAsync(async (req: Request, res: Response) => {
  const newCategory = await createCategory(req.body);
  res.status(201).json({
    success: true,
    message: "category created successfully",
    data: newCategory,
  });
});
