import { test, expect, vi, describe, beforeEach } from "vitest";
import { prisma } from "../../config/lib";
import { appError } from "../../utils/appError";
import { hashPassword, comparePassword } from "../../utils/password";
import { loginUser, registerUser } from "../../services/auth.service";

vi.mock("../../config/lib", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));
vi.mock("../../utils/password", () => ({
  hashPassword: vi.fn(),
  comparePassword: vi.fn(),
}));
describe("auth- registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("successful registration", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    vi.mocked(hashPassword).mockResolvedValue("mocked_hashPass");
    const mockCreatedUser = {
      id: "user-id-123",
      fullName: "Jay Dev",
      email: "jay@example.com",
      username: "jaydev",
      monthlyBudget: 5000,
      currency: "ETB",
      createdAt: new Date(),
    };
    vi.mocked(prisma.user.create).mockResolvedValue(mockCreatedUser as never);
    const input = {
      fullName: "Jay Dev",
      username: "jaydev",
      email: "jay@example.com",
      password: "securePassword123",
      monthlyBudget: 5000,
      currency: "ETB",
    };
    const result = await registerUser(input);
    expect(result).toEqual(mockCreatedUser);
    expect(hashPassword).toHaveBeenCalledWith("securePassword123");
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
  });

  test("email already exists", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
      id: "existing-id",
    } as never);

    const inputData = {
      fullName: "Jay Dev",
      username: "jaydev",
      email: "duplicate@example.com",
      password: "securePassword123",
      monthlyBudget: 1000,
      currency: "ETB",
    };

    await expect(registerUser(inputData)).rejects.toThrow(
      new appError("User with this email already exists", 400),
    );

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  test("should throw an appError if the username already exists", async () => {
    vi.mocked(prisma.user.findFirst)
      .mockResolvedValueOnce(null) // Email is clear
      .mockResolvedValueOnce({ id: "existing-id" } as never);

    const inputData = {
      fullName: "Jay Dev",
      username: "taken_username",
      email: "jay@example.com",
      password: "securePassword123",
      monthlyBudget: 1000,
      currency: "ETB",
    };

    await expect(registerUser(inputData)).rejects.toThrow(
      new appError("User with this username already exists", 400),
    );
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  // --- ERROR PATH 3: SHORT PASSWORD ---
  test("should throw an appError if the password is less than 6 characters long", async () => {
    // Arrange: Databases checks pass seamlessly
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);

    const inputData = {
      fullName: "Jay Dev",
      username: "jaydev",
      email: "jay@example.com",
      password: "12345",
      monthlyBudget: 1000,
      currency: "ETB",
    };

    // Act & Assert
    await expect(registerUser(inputData)).rejects.toThrow(
      new appError("password must be atleast 6 characters long.", 400),
    );
    expect(hashPassword).not.toHaveBeenCalled();
  });
});
//LOGIN USER TEST
describe("auth- loginUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("successful login with email", async () => {
    const mockUser = {
      id: "user-id-123",
      fullName: "Jay Dev",
      email: "jay@example.com",
      username: "jaydev",
      password: "hashedPassword123",
      monthlyBudget: 5000,
      currency: "ETB",
      createdAt: new Date(),
    };
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never);
    vi.mocked(comparePassword).mockResolvedValue(true);

    const input = {
      emailOrUsername: "jay@example.com",
      password: "securePassword123",
    };

    const result = await loginUser(input);

    expect(result).toEqual({
      id: "user-id-123",
      fullName: "Jay Dev",
      email: "jay@example.com",
      username: "jaydev",
      monthlyBudget: 5000,
      currency: "ETB",
      createdAt: mockUser.createdAt,
    });
    expect(comparePassword).toHaveBeenCalledWith(
      "securePassword123",
      "hashedPassword123",
    );
    expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
  });

  test("successful login with username", async () => {
    const mockUser = {
      id: "user-id-456",
      fullName: "Jane Smith",
      email: "jane@example.com",
      username: "janesmith",
      password: "hashedPassword456",
      monthlyBudget: 3000,
      currency: "USD",
      createdAt: new Date(),
    };
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never);
    vi.mocked(comparePassword).mockResolvedValue(true);

    const input = {
      emailOrUsername: "janesmith",
      password: "securePassword456",
    };

    const result = await loginUser(input);

    expect(result).toEqual({
      id: "user-id-456",
      fullName: "Jane Smith",
      email: "jane@example.com",
      username: "janesmith",
      monthlyBudget: 3000,
      currency: "USD",
      createdAt: mockUser.createdAt,
    });
    expect(comparePassword).toHaveBeenCalledWith(
      "securePassword456",
      "hashedPassword456",
    );
  });

  test("should throw an appError if user is not found", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);

    const input = {
      emailOrUsername: "nonexistent@example.com",
      password: "somePassword",
    };

    await expect(loginUser(input)).rejects.toThrow(
      new appError("Invalid credentials!", 401),
    );
    expect(comparePassword).not.toHaveBeenCalled();
  });

  test("should throw an appError if password is incorrect", async () => {
    const mockUser = {
      id: "user-id-123",
      fullName: "Jay Dev",
      email: "jay@example.com",
      username: "jaydev",
      password: "hashedPassword123",
      monthlyBudget: 5000,
      currency: "ETB",
      createdAt: new Date(),
    };
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as never);
    vi.mocked(comparePassword).mockResolvedValue(false);

    const input = {
      emailOrUsername: "jay@example.com",
      password: "wrongPassword",
    };

    await expect(loginUser(input)).rejects.toThrow(
      new appError("Incorrect password!", 401),
    );
    expect(comparePassword).toHaveBeenCalledWith(
      "wrongPassword",
      "hashedPassword123",
    );
  });
});
