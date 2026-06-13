import { describe, expect, test } from "vitest";
import { serializePrismaResult } from "../../utils/prisma-serializer";

describe("Prisma serializer", () => {
  test("converts decimal-like objects to numbers", () => {
    const result = serializePrismaResult({
      monthlyBudget: { toNumber: () => 123.45 },
    });
    expect(result).toEqual({ monthlyBudget: 123.45 });
  });

  test("recursively normalizes nested objects and arrays", () => {
    const payload = {
      user: {
        monthlyBudget: { toNumber: () => 100 },
        expenses: [
          { amount: { toNumber: () => 50 } },
          { amount: { toNumber: () => 25 } },
        ],
      },
    };

    const normalized = serializePrismaResult(payload);

    expect(normalized).toEqual({
      user: {
        monthlyBudget: 100,
        expenses: [{ amount: 50 }, { amount: 25 }],
      },
    });
  });
});
