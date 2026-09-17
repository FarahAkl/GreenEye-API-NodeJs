import z from "zod";

export const createCategoryReqSchema = z.object({
  categoryName: z.string().nonempty(),
  description: z.string().nonempty(),
});

export const updateCategoryReqSchema = z.object({
  categoryName: z.string().optional(),
  description: z.string().optional(),
});
