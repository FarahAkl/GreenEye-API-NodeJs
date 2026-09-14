import type { Request, Response } from "express";
import {
  changePasswordReqSchema,
  forgetPasswordReqSchema,
  loginReqSchema,
  registerReqSchema,
  resendOtpReqSchema,
  resetPasswordReqSchema,
  verifyOtpReqSchema,
} from "../schemas/auth.schema.js";
import { errorResponse, successResponse } from "../utils/helper.js";
import { AppError } from "../utils/appError.js";
import { loginService } from "../services/auth/loginService.js";
import { registerService } from "../services/auth/registerService.js";
import { verifyOtpService } from "../services/auth/verifyOtpService.js";
import { resendOtpService } from "../services/auth/resendOtpService.js";
import { refreshTokenService } from "../services/auth/refreshTokenService.js";
import { forgetPasswordService } from "../services/auth/forgetPasswordService.js";
import { resetPasswordService } from "../services/auth/resetPasswordService.js";
import { changePasswordService } from "../services/auth/changePasswordService.js";

const register = async (req: Request, res: Response) => {
  const validatedReq = registerReqSchema.safeParse(req.body);

  if (!validatedReq.success) {
    return res.status(400).json(
      errorResponse(
        "Validation failed",
        validatedReq.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const validatedData = validatedReq.data;

  const result = await registerService(validatedData);
  return res.status(200).json(successResponse(result.message, result.data));
};

const verifyOtp = async (req: Request, res: Response) => {
  const validatedReq = verifyOtpReqSchema.safeParse(req.body);

  if (!validatedReq.success) {
    return res.status(400).json(
      errorResponse(
        "Validation failed",
        validatedReq.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const validatedData = validatedReq.data;
  const result = await verifyOtpService(validatedData);

  if (validatedData.type === "forget_password")
    res.cookie("resetToken", result.resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

  return res.status(200).json(successResponse(result.message));
};

const login = async (req: Request, res: Response) => {
  const validatedReq = loginReqSchema.safeParse(req.body);

  if (!validatedReq.success) {
    return res.status(400).json(
      errorResponse(
        "Validation failed",
        validatedReq.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const validatedData = validatedReq.data;

  const result = await loginService(validatedData);
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(successResponse(result.message));
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  const result = refreshTokenService(refreshToken);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  return res.status(200).json(successResponse(result.message));
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json(successResponse("Logged out successfully"));
};

const resendOtp = async (req: Request, res: Response) => {
  const validatedReq = resendOtpReqSchema.safeParse(req.body);
  if (!validatedReq.success) {
    return res.status(400).json(
      errorResponse(
        "Validation failed",
        validatedReq.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const validatedData = validatedReq.data;

  const result = await resendOtpService(validatedData);

  return res.status(200).json(successResponse(result.message));
};

const forgetPassword = async (req: Request, res: Response) => {
  const validatedReq = forgetPasswordReqSchema.safeParse(req.body);
  if (!validatedReq.success) {
    return res.status(400).json(
      errorResponse(
        "Validation failed",
        validatedReq.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const validatedData = validatedReq.data;

  const result = await forgetPasswordService(validatedData);

  return res.status(200).json(successResponse(result.message));
};

const resetPassword = async (req: Request, res: Response) => {
  const validatedReq = resetPasswordReqSchema.safeParse(req.body);
  if (!validatedReq.success) {
    return res.status(400).json(
      errorResponse(
        "Validation failed",
        validatedReq.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const validatedData = validatedReq.data;
  const resetToken = req.cookies.resetToken;

  const result = await resetPasswordService({
    data: validatedData,
    resetToken,
  });

  return res.status(200).json(successResponse(result.message));
};

const changePassword = async (req: Request, res: Response) => {
  const validatedReq = changePasswordReqSchema.safeParse(req.body);
  if (!validatedReq.success) {
    return res.status(400).json(
      errorResponse(
        "Validation failed",
        validatedReq.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const validatedData = validatedReq.data;
  const payloadData = req.user;

  if (!payloadData) throw new AppError("Not Authenticated", 401);

  const result = await changePasswordService({
    data: validatedData,
    payloadData,
  });

  return res.status(200).json(successResponse(result.message));
};

export {
  register,
  login,
  logout,
  refreshToken,
  resendOtp,
  verifyOtp,
  resetPassword,
  forgetPassword,
  changePassword,
};
