import type { Request, Response } from "express";
import {
  registerReqSchema,
  verifyOtpReqSchema,
} from "../schemas/auth.schema.js";
import { errorResponse, successResponse } from "../utils/helper.js";
import { registerService, verifyOtpService } from "../services/authService.js";

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
  return res.status(200).json(successResponse(result.message));
};

const login = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const forgetPassword = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const resendOtp = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
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
};
