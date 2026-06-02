import { z } from "zod";
export const expenseInput = z.object({
  title: z.string().max(20, "title can't be more than 20 chars."),
  description: z.string().max(100, "description can't be more than 100 chars"),
  amount: z.number(),
  paymentMethod: z.string(),
  date: z.coerce.date(),
  userId: z.number().positive(),
  categoryId: z.number().positive(),
});
export const expenseQuerySchema = z.object({
  id: z.coerce.number().positive().optional(),
  title: z.string().optional(),
  userId: z.coerce.number().positive().optional(),
  categoryId: z.coerce.number().positive().optional(),
});

export type ExpenseQueryType = z.infer<typeof expenseQuerySchema>;
export type expenseInputType = z.infer<typeof expenseInput>;
