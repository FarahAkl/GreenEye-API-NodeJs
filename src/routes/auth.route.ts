import express from "express";
import {
  register,
  login,
  logout,
  verifyOtp,
  resendOtp,
  forgetPassword,
  resetPassword,
  refreshToken,
} from "../controllers/auth.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const authRouter = express.Router();

authRouter.route("/register").post(asyncHandler(register));

authRouter.route("/verify-otp").post(asyncHandler(verifyOtp));

// authRouter.route("/login").post(login);

// authRouter.route("/logout").post(logout);

// authRouter.route("/resend-otp").post(resendOtp);

// authRouter.route("/forget-password").post(forgetPassword);

// authRouter.route("/reset-password").post(resetPassword);

// authRouter.route("/refresh-token").post(refreshToken);

export { authRouter };
