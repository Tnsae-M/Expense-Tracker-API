import request from "supertest";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import app from "../../app";
import { prisma } from "../../config/lib";

describe("Income Integration Tests", () => {
  let createdUserId: string | null = null;
  let authCookie: string;
  let incomeId: number;
  const unique = Date.now() + Math.floor(Math.random() * 10000);

  beforeAll(async () => {
    // Register user to get cookie
    const registerRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Income Tester",
        username: `inc_user_${String(unique).slice(-8)}`,
        email: `income+${unique}@example.com`,
        password: "Password123!",
        monthlyBudget: 100,
        currency: "USD",
      });
    
    authCookie = registerRes.headers["set-cookie"][0];
    createdUserId = registerRes.body.data.id;
  });

  test("POST /api/v1/income - add income", async () => {
    const res = await request(app)
      .post("/api/v1/income")
      .set("Cookie", authCookie)
      .send({ amount: 1000, source: "Freelance", description: "Project A", date: "2023-11-15" })
      .expect(201);
    
    expect(res.body.success).toBe(true);
    incomeId = res.body.data.id;
  });

  test("GET /api/v1/income - get incomes", async () => {
    const res = await request(app)
      .get("/api/v1/income")
      .set("Cookie", authCookie)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("PATCH /api/v1/income/:id - update income", async () => {
    const res = await request(app)
      .patch(`/api/v1/income/${incomeId}`)
      .set("Cookie", authCookie)
      .send({ amount: 1200, source: "Freelance Updated" })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.amount).toBe(1200);
  });

  test("DELETE /api/v1/income/:id - delete income", async () => {
    await request(app)
      .delete(`/api/v1/income/${incomeId}`)
      .set("Cookie", authCookie)
      .expect(204);
  });

  afterAll(async () => {
    if (createdUserId) {
      try {
        await prisma.user.delete({ where: { id: createdUserId } as any });
      } catch (err) {}
    }
  });
});
