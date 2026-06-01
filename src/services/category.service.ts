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
export { createCategory };
