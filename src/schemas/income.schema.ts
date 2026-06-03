import { z } from "zod";
export const incomeInput = z.object({
  description: z.string().max(100, "description can't be more than 100 chars"),
  source: z.string().max(15, "source can't be more than 15 chars"),
  amount: z.number().positive("amount must be a positive number"),
  date: z.coerce.date().default(new Date()).optional(),
  userId: z.number().positive(),
});
export type incomeInputType = z.infer<typeof incomeInput>;
export const incomeQuerySchema = z.object({
  id: z.coerce.number().positive().optional(),
  description: z.string().optional(),
  userId: z.coerce.number().positive().optional(),
  source: z.string().optional(),
});
export type IncomeQueryType = z.infer<typeof incomeQuerySchema>;
