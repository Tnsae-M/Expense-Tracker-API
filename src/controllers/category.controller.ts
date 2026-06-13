import { Request, Response } from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../services/category.service";
import { catchAsync } from "../utils/catch.async";

export const newCategory = catchAsync(async (req: Request, res: Response) => {
  const newCategory = await createCategory(req.body);
  res.status(201).json({
    success: true,
    message: "category created successfully",
    data: newCategory,
  });
});
export const getAllCategory = catchAsync(
  async (req: Request, res: Response) => {
    const categories = await getAllCategories();
    res.status(200).json({
      success: true,
      message: "categories retrieved successfully",
      data: categories,
    });
  },
);
export const updateCategories = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const cid = Number(id);
    const { name } = req.body;
    const updatedCategory = await updateCategory(cid, name);
    res.status(200).json({
      success: true,
      message: "category updated successfully",
      data: updatedCategory,
    });
  },
);
export const deleteCategories = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await deleteCategory(id);
    res.status(204).send();
  },
);
