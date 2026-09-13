import z from "zod";
import { registerRoles } from "../utils/constants.js";

export const registerReqSchema = z
  .object({
    name: z.string().min(2, "The minimum number of name characters is 2"),
    email: z.email("Not valid email"),
    password: z
      .string()
      .min(8, "The minimum number of password characters is 8")
      .max(256, "The maximum number of password characters is 256"),
    confirm_password: z
      .string()
      .min(8, "The minimum number of password characters is 8")
      .max(256, "The maximum number of password characters is 256"),
    address: z.string().nonempty("This field is required"),
    phoneNumber: z.string().nonempty("This field is required"),
    role: z.enum(registerRoles),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const verifyOtpReqSchema = z.object({
  email: z.email("Not valid email"),
  otp: z.string().length(6),
  type: z.enum(["registration", "forget_password"]),
});

export const loginReqSchema = z.object({
  email: z.email("Not valid email"),
  password: z
    .string()
    .min(8, "The minimum number of password characters is 8")
    .max(256, "The maximum number of password characters is 256"),
});

export type registerReqT = z.infer<typeof registerReqSchema>;
export type verifyOtpT = z.infer<typeof verifyOtpReqSchema>;
export type loginT = z.infer<typeof loginReqSchema>;
