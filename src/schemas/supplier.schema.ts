import z from "zod";

export const createProductReqSchema = z
  .object({
    productName: z.string().nonempty("This field is required"),
    description: z.string(),
    price: z.coerce.number().min(1, "Price must be at least 1"),
    categoryId: z.string().nonempty("This field is required"),
    quantity: z.coerce
      .number()
      .int("Quantity must be an integer")
      .min(1, "Quantity must be at least 1"),
    productionDate: z.coerce.date(),
    expiryDate: z.coerce.date(),
  })
  .refine((data) => data.expiryDate > data.productionDate, {
    message: "Expiry date must be after production date",
    path: ["expiryDate"],
  });

export const updateProductReqSchema = z.object({
  productName: z.string().nullable().optional(),

  description: z.string().nullable().optional(),

  price: z.coerce
    .number({
      error: "Price must be a valid number",
    })
    .min(1, "Price must be at least 1")
    .nullable()
    .optional(),

  categoryId: z.string().nullable().optional(),

  quantity: z.coerce
    .number({
      error: "Quantity must be a valid number",
    })
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative")
    .nullable()
    .optional(),

  productionDate: z.coerce.date().nullable().optional(),
  expiryDate: z.coerce.date().nullable().optional(),
});
export type createProductReqT = z.infer<typeof createProductReqSchema>;
export type updateProductReqT = z.infer<typeof updateProductReqSchema>;
