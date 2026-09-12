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

const authRouter = express.Router();

authRouter.route("/register").post(register);

// authRouter.route("/login").post(login);

// authRouter.route("/logout").post(logout);

// authRouter.route("/verify-otp").post(verifyOtp);

// authRouter.route("/resend-otp").post(resendOtp);

// authRouter.route("/forget-password").post(forgetPassword);

// authRouter.route("/reset-password").post(resetPassword);

// authRouter.route("/refresh-token").post(refreshToken);

export { authRouter };
