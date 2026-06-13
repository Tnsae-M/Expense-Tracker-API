import { test, expect, vi, describe, beforeEach } from "vitest";
import { prisma } from "../../config/lib";
import { appError } from "../../utils/appError";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../../services/category.service";

vi.mock("../../config/lib", () => ({
  prisma: {
    category: {
      findUnique: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("Category Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createCategory", () => {
    test("should create category successfully", async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue(null);
      const mockCategory = { id: 1, name: "Food" };
      vi.mocked(prisma.category.create).mockResolvedValue(mockCategory as never);

      const result = await createCategory({ name: "Food" });

      expect(result).toEqual(mockCategory);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { name: "Food" },
      });
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: { name: "Food" },
      });
    });

    test("should throw error if name is missing", async () => {
      await expect(createCategory({ name: "" })).rejects.toThrow(
        new appError("missing name field", 400)
      );
    });

    test("should throw error if category already exists", async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue({ id: 1, name: "Food" } as never);

      await expect(createCategory({ name: "Food" })).rejects.toThrow(
        new appError("category with this name already exists", 400)
      );
    });
  });

  describe("getAllCategories", () => {
    test("should return all categories", async () => {
      const mockCategories = [{ id: 1, name: "Food" }, { id: 2, name: "Travel" }];
      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as never);

      const result = await getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(prisma.category.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateCategory", () => {
    test("should update category successfully", async () => {
      const mockUpdatedCategory = { id: 1, name: "Food Updated" };
      vi.mocked(prisma.category.update).mockResolvedValue(mockUpdatedCategory as never);

      const result = await updateCategory(1, "Food Updated");

      expect(result).toEqual(mockUpdatedCategory);
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: "Food Updated" },
      });
    });

    test("should throw error if id or name missing", async () => {
      await expect(updateCategory(0, "Name")).rejects.toThrow(
        new appError("missing id or name field", 400)
      );
      await expect(updateCategory(1, "")).rejects.toThrow(
        new appError("missing id or name field", 400)
      );
    });
  });

  describe("deleteCategory", () => {
    test("should delete category successfully", async () => {
      const mockDeletedCategory = { id: 1, name: "Food" };
      vi.mocked(prisma.category.delete).mockResolvedValue(mockDeletedCategory as never);

      const result = await deleteCategory(1);

      expect(result).toEqual(mockDeletedCategory);
      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("should throw error if id is missing", async () => {
      await expect(deleteCategory(0)).rejects.toThrow(
        new appError("missing id field", 400)
      );
    });
  });
});
