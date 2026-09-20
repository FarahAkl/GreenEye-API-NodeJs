import z from "zod";

export const productFilterSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(100).optional(),

  status: z.enum(["pending", "approved", "rejected"]).optional(),

  category: z.string().optional(),

  search: z.string().trim().optional(),

  minPrice: z.coerce.number().min(0).optional(),

  maxPrice: z.coerce.number().min(0).optional(),

  createdFrom: z.coerce.date().optional(),

  createdTo: z.coerce.date().optional(),
});

export type productFilterT = z.infer<typeof productFilterSchema>;
