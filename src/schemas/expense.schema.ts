import { z } from "zod";
export const expenseInput = z.object({
  title: z.string().max(20, "title can't be more than 20 chars."),
  description: z.string().max(100, "description can't be more than 100 chars"),
  amount: z.number(),
  paymentMethod: z.string(),
  date: z.coerce.date().default(new Date()),
  userId: z.string().optional(),
  categoryId: z.number().positive(),
});
export const expenseQuerySchema = z.object({
  id: z.coerce.number().positive().optional(),
  search: z.string().optional(),
  category: z.coerce.string().optional(),
  page: z.coerce.number().int().default(1),
  limit: z.coerce.number().int().default(10),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minAmount: z.coerce.number().int().optional(),
  maxAmount: z.coerce.number().int().optional(),
});

export type ExpenseQueryType = z.infer<typeof expenseQuerySchema>;
export type expenseInputType = z.infer<typeof expenseInput>;
export const ExpenseUpdateSchema = expenseInput.partial();
export type expenseUpdateType = z.infer<typeof ExpenseUpdateSchema>;
