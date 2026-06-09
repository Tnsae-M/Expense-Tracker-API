import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(6, "Name must be atleast 6 characters long")
      .max(50, "Name must be less than 50 characters long"),
    username: z
      .string()
      .min(3, "Username must be atleast 3 characters long")
      .max(20, "Username must be less than 20 characters long"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be atleast 6 characters long")
      .max(20, "Password must be less than 20 characters long"),
    monthlyBudget: z
      .number()
      .positive("Monthly budget must be a positive number")
      .default(0),
    currency: z
      .string()
      .min(3, "Currency must be atleast 3 characters long")
      .max(10, "Currency must be less than 10 characters long")
      .default("ETB"),
  })
  .strict();
export const signInSchema = z.object({
  emailOrUsername: z.string().trim().toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be atleast 6 chars long.")
    .max(20, "password is too long."),
});
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;
