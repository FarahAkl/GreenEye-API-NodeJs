import z from "zod";

export const updateProfileReqSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  avatar: z.string().optional(),
});

export type updateProfileT = z.infer<typeof updateProfileReqSchema>;
