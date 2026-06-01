import { CategoryModel } from "../../prisma/generated/prisma/models/Category";
import { prisma } from "../config/lib";
import { appError } from "../utils/appError";

async function createCategory(data: CategoryModel): Promise<CategoryModel> {
  const { name } = data;
  if (!name) {
    throw new appError("missing name field", 400);
  }
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: name,
    },
  });
  if (existingCategory) {
    throw new appError("category with this name already exists", 400);
  }

  const newCategory = await prisma.category.create({
    data: data,
  });
  return newCategory;
}
async function getAllCategories(): Promise<CategoryModel[]> {
  const categories = await prisma.category.findMany();
  if (!categories) {
    throw new appError("no categories found", 404);
  }
  return categories;
}
async function updateCategory(data: CategoryModel): Promise<CategoryModel> {
  const { id, name } = data;
  if (!id || !name) {
    throw new appError("missing id or name field", 400);
  }
  const updatedCategory = await prisma.category.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });
  return updatedCategory;
}
async function deleteCategory(id: number) {
  if (!id) {
    throw new appError("missing id field", 400);
  }
  const deletedCategory = await prisma.category.delete({
    where: {
      id: id,
    },
  });
  return deletedCategory;
}
export { createCategory, getAllCategories, updateCategory, deleteCategory };
