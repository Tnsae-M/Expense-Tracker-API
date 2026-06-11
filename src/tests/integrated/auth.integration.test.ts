import request from "supertest";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import app from "../../app";
import { prisma } from "../../config/lib";

describe("Auth Integration - register & login flow", () => {
  let createdUserId: string | null = null;
  const password = "IntegrationPass123!";
  const unique = Date.now();
  const testEmail = `integration+${unique}@example.com`;
  const testUsername = `integration_${String(unique).slice(-8)}`;

  beforeAll(async () => {
    // ensure no leftovers
    await prisma.user.deleteMany({ where: { email: testEmail } as any });
  });

  test("register -> login -> returns cookies and user data", async () => {
    // Register
    const registerRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Integration Tester",
        username: testUsername,
        email: testEmail,
        password: password,
        monthlyBudget: 100,
        currency: "USD",
      })
      .expect(201);

    expect(registerRes.body).toHaveProperty("success", true);
    expect(registerRes.body).toHaveProperty("data");
    expect(registerRes.body.data).toHaveProperty("id");
    createdUserId = registerRes.body.data.id;
    expect(registerRes.headers["set-cookie"]).toBeDefined();

    // Login using email
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ emailOrUsername: testEmail, password })
      .expect(200);

    expect(loginRes.body).toHaveProperty("success", true);
    expect(loginRes.body).toHaveProperty("data");
    expect(loginRes.body.data).toHaveProperty("id", createdUserId);
    expect(loginRes.headers["set-cookie"]).toBeDefined();

    // Login using username
    const loginRes2 = await request(app)
      .post("/api/v1/auth/login")
      .send({ emailOrUsername: testUsername, password })
      .expect(200);

    expect(loginRes2.body).toHaveProperty("success", true);
    expect(loginRes2.body.data).toHaveProperty("username", testUsername);
    expect(loginRes2.headers["set-cookie"]).toBeDefined();
  });

  afterAll(async () => {
    if (createdUserId) {
      try {
        await prisma.user.delete({ where: { id: createdUserId } as any });
      } catch (err) {
        // ignore cleanup errors
      }
    }
    await prisma.$disconnect();
  });
});
