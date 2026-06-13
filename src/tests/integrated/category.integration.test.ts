import request from "supertest";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import app from "../../app";
import { prisma } from "../../config/lib";

describe("Category Integration Tests", () => {
  let createdUserId: string | null = null;
  let authCookie: string;
  let createdCategoryId: number | null = null;
  const unique = Date.now() + Math.floor(Math.random() * 10000);
  const testCategoryName = `IntegrationCategory_${unique}`;

  beforeAll(async () => {
    // Register user to get cookie
    const registerRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Category Tester",
        username: `cat_user_${String(unique).slice(-8)}`,
        email: `category+${unique}@example.com`,
        password: "Password123!",
        monthlyBudget: 100,
        currency: "USD",
      });
    
    authCookie = registerRes.headers["set-cookie"][0];
    createdUserId = registerRes.body.data.id;
  });

  test("POST /api/v1/categories - create new category", async () => {
    const res = await request(app)
      .post("/api/v1/categories")
      .set("Cookie", authCookie)
      .send({ name: testCategoryName })
      .expect(201);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("name", testCategoryName);
    createdCategoryId = res.body.data.id;
  });

  test("GET /api/v1/categories - get all categories", async () => {
    const res = await request(app)
      .get("/api/v1/categories")
      .set("Cookie", authCookie)
      .expect(200);

    expect(res.body).toHaveProperty("success", true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const createdCat = res.body.data.find((c: any) => c.id === createdCategoryId);
    expect(createdCat).toBeDefined();
    expect(createdCat.name).toBe(testCategoryName);
  });

  test("PATCH /api/v1/categories/:id - update category", async () => {
    const updatedName = `${testCategoryName}_updated`;
    const res = await request(app)
      .patch(`/api/v1/categories/${createdCategoryId}`)
      .set("Cookie", authCookie)
      .send({ name: updatedName })
      .expect(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body.data).toHaveProperty("name", updatedName);
  });

  test("DELETE /api/v1/categories/:id - delete category", async () => {
    await request(app)
      .delete(`/api/v1/categories/${createdCategoryId}`)
      .set("Cookie", authCookie)
      .expect(204);

    // Verify it is deleted
    const res = await request(app)
      .get("/api/v1/categories")
      .set("Cookie", authCookie)
      .expect(200);

    const deletedCat = res.body.data.find((c: any) => c.id === createdCategoryId);
    expect(deletedCat).toBeUndefined();
  });

  afterAll(async () => {
    // Cleanup
    if (createdCategoryId) {
      try {
        await prisma.category.delete({ where: { id: createdCategoryId } });
      } catch (err) {}
    }
    if (createdUserId) {
      try {
        await prisma.user.delete({ where: { id: createdUserId } as any });
      } catch (err) {}
    }
    await prisma.$disconnect();
  });
});
