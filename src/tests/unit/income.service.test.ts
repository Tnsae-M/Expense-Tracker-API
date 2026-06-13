import { test, expect, vi, describe, beforeEach } from "vitest";
import { prisma } from "../../config/lib";
import { appError } from "../../utils/appError";
import {
  addIncome,
  getIncomeByFilter,
  updateIncome,
  deleteIncome,
} from "../../services/income.service";

vi.mock("../../config/lib", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    income: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("Income Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addIncome", () => {
    test("should add income successfully", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "user-123" } as never);
      const mockIncome = { id: 1, amount: 500, source: "Salary", userId: "user-123", date: new Date() };
      vi.mocked(prisma.income.create).mockResolvedValue(mockIncome as never);

      const result = await addIncome({ amount: 500, source: "Salary", date: "2023-11-01" }, "user-123");
      expect(result).toEqual(mockIncome);
    });

    test("should throw error if user not found", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      await expect(addIncome({ amount: 500, source: "Salary" }, "user-123")).rejects.toThrow(new appError("User not found", 404));
    });
  });

  describe("getIncomeByFilter", () => {
    test("should get incomes by filter", async () => {
      const mockIncomes = [{ id: 1, amount: 500, source: "Salary" }];
      vi.mocked(prisma.income.findMany).mockResolvedValue(mockIncomes as never);

      const result = await getIncomeByFilter({ source: "Salary" }, "user-123");
      expect(result).toEqual(mockIncomes);
    });
  });

  describe("updateIncome", () => {
    test("should update income successfully", async () => {
      vi.mocked(prisma.income.findUnique).mockResolvedValue({ id: 1, userId: "user-123" } as never);
      const mockUpdated = { id: 1, amount: 600, source: "Bonus" };
      vi.mocked(prisma.income.update).mockResolvedValue(mockUpdated as never);

      const result = await updateIncome({ amount: 600, source: "Bonus" }, 1, "user-123");
      expect(result).toEqual(mockUpdated);
    });
  });

  describe("deleteIncome", () => {
    test("should delete income successfully", async () => {
      vi.mocked(prisma.income.findUnique).mockResolvedValue({ id: 1, userId: "user-123" } as never);
      const mockDeleted = { id: 1 };
      vi.mocked(prisma.income.delete).mockResolvedValue(mockDeleted as never);

      const result = await deleteIncome(1, "user-123");
      expect(result).toEqual(mockDeleted);
    });
  });
});
