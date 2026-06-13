import request from "supertest";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import app from "../../app";
import { prisma } from "../../config/lib";

describe("Expense Integration Tests", () => {
  let createdUserId: string | null = null;
  let authCookie: string;
  let categoryId: number;
  let expenseId: number;
  const unique = Date.now() + Math.floor(Math.random() * 10000);

  beforeAll(async () => {
    // Register user to get cookie
    const registerRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Expense Tester",
        username: `exp_user_${String(unique).slice(-8)}`,
        email: `expense+${unique}@example.com`,
        password: "Password123!",
        monthlyBudget: 100,
        currency: "USD",
      });

    authCookie = registerRes.headers["set-cookie"][0];
    createdUserId = registerRes.body.data.id;

    // Create a category to use in expenses
    const catRes = await request(app)
      .post("/api/v1/categories")
      .set("Cookie", authCookie)
      .send({ name: `ExpCat_${Date.now()}` });
    categoryId = catRes.body.data.id;
  });

  test("POST /api/v1/expenses - create expense", async () => {
    const res = await request(app)
      .post("/api/v1/expenses")
      .set("Cookie", authCookie)
      .send({
        title: "Test Expense",
        description: "Test description",
        amount: 150.5,
        paymentMethod: "Cash",
        categoryId: categoryId,
        userId: createdUserId,
        date: "2023-12-01",
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expenseId = res.body.data.id;
  });

  test("GET /api/v1/expenses - get expenses", async () => {
    const res = await request(app)
      .get("/api/v1/expenses")
      .set("Cookie", authCookie)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("PATCH /api/v1/expenses/:id - update expense", async () => {
    const res = await request(app)
      .patch(`/api/v1/expenses/${expenseId}`)
      .set("Cookie", authCookie)
      .send({ amount: 200, categoryId })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.amount).toBe(200);
  });

  test("DELETE /api/v1/expenses/:id - delete expense", async () => {
    await request(app)
      .delete(`/api/v1/expenses/${expenseId}`)
      .set("Cookie", authCookie)
      .expect(204);
  });

  afterAll(async () => {
    if (categoryId) {
      try {
        await prisma.category.delete({ where: { id: categoryId } });
      } catch (err) {}
    }
    if (createdUserId) {
      try {
        await prisma.user.delete({ where: { id: createdUserId } as any });
      } catch (err) {}
    }
  });
});
