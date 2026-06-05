import { z } from "zod";
export const analyticsQuerySchema = z.object({
  month: z.coerce
    .number()
    .int()
    .min(1, { message: "month must be between 1 and 12." })
    .max(12, { message: "month must be between 1 and 12." })
    .optional(), //default(()=>new Date().getMonth()+1)
  year: z.coerce
    .number()
    .int()
    .min(2000, { message: "year must be 2000 or later" })
    .max(2100, { message: "year must be realistic." })
    .optional()
    .default(() => new Date().getFullYear()),
});
export type AnalyticsQuerySchema = z.infer<typeof analyticsQuerySchema>;
