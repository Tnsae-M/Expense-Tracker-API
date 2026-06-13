import { test, expect, vi, describe, beforeEach } from "vitest";
import { prisma } from "../../config/lib";
import { appError } from "../../utils/appError";
import {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
} from "../../services/expense.service";

vi.mock("../../config/lib", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    category: { findUnique: vi.fn() },
    expense: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe("Expense Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createExpense", () => {
    test("should create expense successfully", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "user-123" } as never);
      vi.mocked(prisma.category.findUnique).mockResolvedValue({ id: 1 } as never);
      const mockExpense = { id: 1, amount: 100, title: "Lunch", categoryId: 1, userId: "user-123", date: new Date() };
      vi.mocked(prisma.expense.create).mockResolvedValue(mockExpense as never);

      const result = await createExpense({ amount: 100, title: "Lunch", categoryId: 1, date: "2023-10-10" }, "user-123");
      expect(result).toEqual(mockExpense);
    });

    test("should throw error if user not found", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      await expect(createExpense({ amount: 100, title: "Lunch", categoryId: 1, date: "2023-10-10" }, "user-123")).rejects.toThrow(new appError("User not found!", 404));
    });
  });

  describe("getExpense", () => {
    test("should get expenses with pagination", async () => {
      const mockExpenses = [{ id: 1, amount: 100 }];
      vi.mocked(prisma.$transaction).mockResolvedValue([mockExpenses, 1] as never);

      const result = await getExpense({ limit: 10, page: 1 }, "user-123");
      expect(result.expenses).toEqual(mockExpenses);
      expect(result.pageRecords).toBe(1);
    });
  });

  describe("updateExpense", () => {
    test("should update expense successfully", async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue({ id: 2 } as never);
      vi.mocked(prisma.expense.findUnique).mockResolvedValue({ id: 1, userId: "user-123" } as never);
      const mockUpdated = { id: 1, amount: 200, categoryId: 2 };
      vi.mocked(prisma.expense.update).mockResolvedValue(mockUpdated as never);

      const result = await updateExpense({ amount: 200, categoryId: 2 }, 1, "user-123");
      expect(result).toEqual(mockUpdated);
    });
  });

  describe("deleteExpense", () => {
    test("should delete expense successfully", async () => {
      vi.mocked(prisma.expense.findUnique).mockResolvedValue({ id: 1, userId: "user-123" } as never);
      const mockDeleted = { id: 1 };
      vi.mocked(prisma.expense.delete).mockResolvedValue(mockDeleted as never);

      const result = await deleteExpense(1, "user-123");
      expect(result).toEqual(mockDeleted);
    });
  });
});
