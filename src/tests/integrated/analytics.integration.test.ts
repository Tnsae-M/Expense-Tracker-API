import request from "supertest";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import app from "../../app";
import { prisma } from "../../config/lib";

describe("Analytics Integration Tests", () => {
  let createdUserId: string | null = null;
  let authCookie: string;
  const unique = Date.now() + Math.floor(Math.random() * 10000);

  beforeAll(async () => {
    // Register user to get cookie
    const registerRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Analytics Tester",
        username: `ana_user_${String(unique).slice(-8)}`,
        email: `analytics+${unique}@example.com`,
        password: "Password123!",
        monthlyBudget: 100,
        currency: "USD",
      });
    
    authCookie = registerRes.headers["set-cookie"][0];
    createdUserId = registerRes.body.data.id;
  });

  test("GET /api/v1/analytics/summary - get monthly analytics", async () => {
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();

    const res = await request(app)
      .get(`/api/v1/analytics/summary?month=${currentMonth}&year=${currentYear}`)
      .set("Cookie", authCookie)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("totalIncome");
    expect(res.body.data).toHaveProperty("totalExpense");
    expect(res.body.data).toHaveProperty("budget_comparision");
  });

  afterAll(async () => {
    if (createdUserId) {
      try {
        await prisma.user.delete({ where: { id: createdUserId } as any });
      } catch (err) {}
    }
  });
});
