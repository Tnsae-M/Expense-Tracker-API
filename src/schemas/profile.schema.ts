import { z } from "zod";

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .min(6, "Name must be atleast 6 characters long")
      .max(50, "Name must be less than 50 characters long"),
    username: z
      .string()
      .min(3, "Username must be atleast 3 characters long")
      .max(20, "Username must be less than 20 characters long"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be atleast 6 characters long")
      .max(20, "Password must be less than 20 characters long"),
    monthlyBudget: z
      .number()
      .positive("Monthly budget must be a positive number"),
    currency: z
      .string()
      .min(3, "Currency must be atleast 3 characters long")
      .max(10, "Currency must be less than 10 characters long"),
  })
  .strict();
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
