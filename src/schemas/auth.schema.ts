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

export const resendOtpReqSchema = z.object({
  type: z.enum(["registration", "forget_password"]),
  email: z.email("Not valid email"),
});

export const forgetPasswordReqSchema = z.object({
  email: z.email("Not valid email"),
});

export const resetPasswordReqSchema = z
  .object({
    password: z
      .string()
      .min(8, "The minimum number of password characters is 8")
      .max(256, "The maximum number of password characters is 256"),
    confirm_password: z
      .string()
      .min(8, "The minimum number of password characters is 8")
      .max(256, "The maximum number of password characters is 256"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const changePasswordReqSchema = z
  .object({
    old_password: z.string().nonempty("This field is required"),
    password: z
      .string()
      .min(8, "The minimum number of password characters is 8")
      .max(256, "The maximum number of password characters is 256"),
    confirm_password: z
      .string()
      .min(8, "The minimum number of password characters is 8")
      .max(256, "The maximum number of password characters is 256"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type registerReqT = z.infer<typeof registerReqSchema>;
export type verifyOtpT = z.infer<typeof verifyOtpReqSchema>;
export type loginT = z.infer<typeof loginReqSchema>;
export type resendOtpT = z.infer<typeof resendOtpReqSchema>;
export type forgetPasswordT = z.infer<typeof forgetPasswordReqSchema>;
export type resetPasswordT = z.infer<typeof resetPasswordReqSchema>;
export type changePasswordT = z.infer<typeof changePasswordReqSchema>;
