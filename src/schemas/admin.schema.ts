import z from "zod";
import { userRoles } from "../utils/constants.js";

export const usersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  role: z.enum(userRoles).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export const userChangeRoleReqSchema = z.object({
  role: z.enum(userRoles),
});

export const rejectReasonSchema = z.object({
  rejectReason: z.string().nonempty("This field is required"),
});

export type UsersQueryT = z.infer<typeof usersQuerySchema>;
export type rejectReasonT = z.infer<typeof rejectReasonSchema>;
