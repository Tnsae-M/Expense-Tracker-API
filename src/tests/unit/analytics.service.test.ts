import { test, expect, vi, describe, beforeEach } from "vitest";
import { prisma } from "../../config/lib";
import { getMonthlyAnalytics } from "../../services/analytics.service";

vi.mock("../../config/lib", () => ({
  prisma: {
    category: { findMany: vi.fn() },
    income: { aggregate: vi.fn() },
    expense: { aggregate: vi.fn(), groupBy: vi.fn() },
    user: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}));

describe("Analytics Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMonthlyAnalytics", () => {
    test("should return calculated monthly analytics", async () => {
      vi.mocked(prisma.category.findMany).mockResolvedValue([
        { id: 1, name: "Food" },
      ] as never);

      const mockTotalIncome = { _sum: { amount: 5000 } };
      const mockTotalExpense = { _sum: { amount: 2000 } };
      const mockCategoryGroups = [{ categoryId: 1, _sum: { amount: 2000 } }];
      const mockTopSpending = [{ categoryId: 1, _sum: { amount: 2000 } }];
      const mockUserBudget = { monthlyBudget: 4000 };

      vi.mocked(prisma.$transaction).mockResolvedValue([
        mockTotalIncome,
        mockTotalExpense,
        mockCategoryGroups,
        mockTopSpending,
        mockUserBudget,
      ] as never);

      const filter = { month: 11, year: 2023, category: "Food" };
      const result = await getMonthlyAnalytics(filter, "user-123");

      expect(result.totalIncome).toBe(5000);
      expect(result.totalExpense).toBe(2000);
      expect(result.remaining_balance).toBe(3000);
      expect(result.budget_comparision.difference).toBe(2000); // budget(4000) - expense(2000)
      expect(result.budget_comparision.spending_percentage).toBe(50);
      expect(result.top_spending_category?.name).toBe("Food");
      expect(result.top_spending_category?.totalSpent).toBe(2000);
      expect(result.categorySpending[0].category).toBe("Food");
    });
  });
});
