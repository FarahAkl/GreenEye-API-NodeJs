import z from "zod";
import { userRoles } from "../utils/constants.js";

export const usersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  role: z.enum(userRoles).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export type UsersQueryT = z.infer<typeof usersQuerySchema>;
