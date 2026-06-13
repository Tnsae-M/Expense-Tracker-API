import request from "supertest";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import app from "../../app";
import { prisma } from "../../config/lib";

describe("User Integration - fetch & update profile", () => {
  let createdUserId: string | null = null;
  let authCookie: string;
  const password = "IntegrationPass123!";
  const unique = Date.now() + Math.floor(Math.random() * 10000);
  const testEmail = `user_integration+${unique}@example.com`;
  const testUsername = `usr_int_${String(unique).slice(-8)}`;

  beforeAll(async () => {
    // Register user to get cookie
    const registerRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "User Integration Tester",
        username: testUsername,
        email: testEmail,
        password: password,
        monthlyBudget: 100,
        currency: "USD",
      });
    
    authCookie = registerRes.headers["set-cookie"][0];
    createdUserId = registerRes.body.data.id;
  });

  test("GET /api/v1/users/me - fetch profile", async () => {
    const res = await request(app)
      .get("/api/v1/users/me")
      .set("Cookie", authCookie)
      .expect(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("username", testUsername);
    expect(res.body.data).toHaveProperty("email", testEmail);
    expect(res.body.data).toHaveProperty("monthlyBudget", 100);
    // password should not be present
    expect(res.body.data).not.toHaveProperty("password");
  });

  test("PATCH /api/v1/users/me - update profile", async () => {
    const res = await request(app)
      .patch("/api/v1/users/me")
      .set("Cookie", authCookie)
      .send({
        monthlyBudget: 200,
        fullName: "Updated Name",
      })
      .expect(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("profile");
    expect(res.body.profile).toHaveProperty("monthlyBudget", 200);
    expect(res.body.profile).toHaveProperty("fullName", "Updated Name");
    expect(res.body.profile).not.toHaveProperty("password");
  });

  test("PATCH /api/v1/users/me - no changes provided", async () => {
    const res = await request(app)
      .patch("/api/v1/users/me")
      .set("Cookie", authCookie)
      .send({})
      .expect(200);

    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "No changes detected, profile remains unchanged");
  });

  test("GET /api/v1/users/me - unauthorized without cookie", async () => {
    await request(app)
      .get("/api/v1/users/me")
      .expect(401);
  });

  afterAll(async () => {
    if (createdUserId) {
      try {
        await prisma.user.delete({ where: { id: createdUserId } as any });
      } catch (err) {
        // ignore
      }
    }
    await prisma.$disconnect();
  });
});
