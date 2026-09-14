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
  changePassword,
} from "../controllers/auth.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { verifyToken } from "../middleware/verifyToken.js";

const authRouter = express.Router();

authRouter.route("/register").post(asyncHandler(register));

authRouter.route("/verify-otp").post(asyncHandler(verifyOtp));

authRouter.route("/login").post(asyncHandler(login));

authRouter.route("/refresh-token").post(asyncHandler(refreshToken));

authRouter.route("/logout").post(logout);

authRouter.route("/resend-otp").post(asyncHandler(resendOtp));

authRouter.route("/forget-password").post(asyncHandler(forgetPassword));

authRouter.route("/reset-password").post(asyncHandler(resetPassword));

authRouter
  .route("/change-password")
  .post(verifyToken, asyncHandler(changePassword));

export { authRouter };
