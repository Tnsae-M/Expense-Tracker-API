import { test, expect, vi, describe, beforeEach } from "vitest";
import { prisma } from "../../config/lib";
import { fetchProfile, updateUserProfile } from "../../services/user.service";
import { hashPassword } from "../../utils/password";

vi.mock("../../config/lib", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("../../utils/password", () => ({
  hashPassword: vi.fn(),
}));

describe("User Service - fetchProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should fetch user profile successfully", async () => {
    const mockProfile = {
      fullName: "Jay Dev",
      username: "jaydev",
      email: "jay@example.com",
      monthlyBudget: 5000,
      currency: "ETB",
    };
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockProfile as never);

    const result = await fetchProfile("user-id-123");
    
    expect(result).toEqual(mockProfile);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-id-123" },
      select: {
        fullName: true,
        username: true,
        email: true,
        monthlyBudget: true,
        currency: true,
      },
    });
  });
});

describe("User Service - updateUserProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should update user profile successfully without password", async () => {
    const mockUpdatedUser = {
      id: "user-id-123",
      fullName: "Jay Dev Updated",
      email: "jay@example.com",
      username: "jaydev",
      password: "hashedPassword123",
      monthlyBudget: 6000,
      currency: "ETB",
      createdAt: new Date(),
    };
    vi.mocked(prisma.user.update).mockResolvedValue(mockUpdatedUser as never);

    const inputData = {
      fullName: "Jay Dev Updated",
      monthlyBudget: 6000,
    };
    const result = await updateUserProfile(inputData, "user-id-123");

    const { password: _, ...safeUser } = mockUpdatedUser;
    expect(result).toEqual(safeUser);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-id-123" },
      data: inputData,
    });
    expect(hashPassword).not.toHaveBeenCalled();
  });

  test("should hash password if provided during update", async () => {
    const mockUpdatedUser = {
      id: "user-id-123",
      fullName: "Jay Dev",
      email: "jay@example.com",
      username: "jaydev",
      password: "newHashedPassword",
      monthlyBudget: 5000,
      currency: "ETB",
      createdAt: new Date(),
    };
    vi.mocked(prisma.user.update).mockResolvedValue(mockUpdatedUser as never);
    vi.mocked(hashPassword).mockResolvedValue("newHashedPassword");

    const inputData = {
      password: "newPlainPassword123",
    };
    
    const result = await updateUserProfile(inputData, "user-id-123");

    const { password: _, ...safeUser } = mockUpdatedUser;
    expect(result).toEqual(safeUser);
    expect(hashPassword).toHaveBeenCalledWith("newPlainPassword123");
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-id-123" },
      data: { password: "newHashedPassword" },
    });
  });
});
