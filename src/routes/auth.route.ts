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
import { upload } from "../config/multer.js";

const authRouter = express.Router();

 /**
  * @swagger
  * /api/auth/register:
  *   post:
  *     summary: Register a new user
  *     tags:
  *       - Auth
  *     requestBody:
  *       required: true
  *       content:
  *         multipart/form-data:
  *           schema:
  *             type: object
  *             required:
  *               - name
  *               - email
  *               - password
  *               - confirm_password
  *               - address
  *               - phoneNumber
  *               - role
  *             properties:
  *               name:
  *                 type: string
  *                 minLength: 2
  *                 example: Farah Hesham
  *               email:
  *                 type: string
  *                 format: email
  *                 example: farah@example.com
  *               password:
  *                 type: string
  *                 format: password
  *                 minLength: 8
  *                 maxLength: 256
  *                 example: Password123!
  *               confirm_password:
  *                 type: string
  *                 format: password
  *                 minLength: 8
  *                 maxLength: 256
  *                 example: Password123!
  *               address:
  *                 type: string
  *                 example: Mansoura, Egypt
  *               phoneNumber:
  *                 type: string
  *                 example: "01012345678"
  *               role:
  *                 type: string
  *                 enum:
  *                   - user
  *                   - expert
  *                   - supplier
  *                 example: user
  *               avatar:
  *                 type: string
  *                 format: binary
  *     responses:
  *       200:
  *         description: Registration successful and OTP sent to email
  *       400:
  *         description: Validation failed
  *       409:
  *         description: User already exists
  */
authRouter
  .route("/register")
  .post(upload.single("avatar"), asyncHandler(register));

authRouter
  .route("/register")
  .post(upload.single("avatar"), asyncHandler(register));

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
