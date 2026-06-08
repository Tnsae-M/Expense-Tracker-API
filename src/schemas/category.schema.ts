import { z } from "zod";

export const CategorySchema = z
  .object({
    id: z.number().int().optional(),
    name: z.string("category name is required"),
  })
  .strict();
export type CategoryType = z.infer<typeof CategorySchema>;
