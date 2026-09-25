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

/** @swagger
 * /api/auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify a six-digit email OTP
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [email, otp, type], properties: { email: { type: string, format: email }, otp: { type: string, minLength: 6, maxLength: 6 }, type: { type: string, enum: [registration, forget_password] } } } } }
 *     responses: { '200': { description: OTP verified }, '400': { description: Validation failed } }
 */
authRouter.route("/verify-otp").post(asyncHandler(verifyOtp));

/** @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Sign in with email and password
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [email, password], properties: { email: { type: string, format: email }, password: { type: string, format: password, minLength: 8, maxLength: 256 } } } } }
 *     responses: { '200': { description: Signed in }, '400': { description: Validation failed }, '401': { description: Invalid credentials } }
 */
authRouter.route("/login").post(asyncHandler(login));

/** @swagger
 * /api/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh the access token using the refresh-token cookie
 *     responses: { '200': { description: Access token refreshed }, '401': { description: Invalid or missing refresh token } }
 */
authRouter.route("/refresh-token").post(asyncHandler(refreshToken));

/** @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Sign out and clear authentication cookies
 *     responses: { '200': { description: Signed out } }
 */
authRouter.route("/logout").post(logout);

/** @swagger
 * /api/auth/resend-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Resend a registration or password-reset OTP
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [email, type], properties: { email: { type: string, format: email }, type: { type: string, enum: [registration, forget_password] } } } } }
 *     responses: { '200': { description: OTP sent }, '400': { description: Validation failed } }
 */
authRouter.route("/resend-otp").post(asyncHandler(resendOtp));

/** @swagger
 * /api/auth/forget-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request a password-reset OTP
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [email], properties: { email: { type: string, format: email } } } } }
 *     responses: { '200': { description: Reset OTP sent }, '400': { description: Validation failed } }
 */
authRouter.route("/forget-password").post(asyncHandler(forgetPassword));

/** @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password after OTP verification
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [password, confirm_password], properties: { password: { type: string, format: password, minLength: 8, maxLength: 256 }, confirm_password: { type: string, format: password, minLength: 8, maxLength: 256 } } } } }
 *     responses: { '200': { description: Password reset }, '400': { description: Validation failed } }
 */
authRouter.route("/reset-password").post(asyncHandler(resetPassword));

/** @swagger
 * /api/auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Change the authenticated user's password
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [old_password, password, confirm_password], properties: { old_password: { type: string, format: password }, password: { type: string, format: password, minLength: 8, maxLength: 256 }, confirm_password: { type: string, format: password, minLength: 8, maxLength: 256 } } } } }
 *     responses: { '200': { description: Password changed }, '400': { description: Validation failed }, '401': { description: Not authenticated } }
 */
authRouter
  .route("/change-password")
  .post(verifyToken, asyncHandler(changePassword));

export { authRouter };
