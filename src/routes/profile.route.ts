import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  deleteProfile,
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";
import { upload } from "../config/multer.js";

const profileRouter = express.Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get the authenticated user's profile
 *     security: [{ bearerAuth: [] }]
 *     responses: { '200': { description: Profile retrieved successfully }, '401': { description: Not authenticated } }
 *   delete:
 *     tags: [Profile]
 *     summary: Delete the authenticated user's profile
 *     security: [{ bearerAuth: [] }]
 *     responses: { '200': { description: Profile deleted successfully }, '401': { description: Not authenticated } }
 *   patch:
 *     tags: [Profile]
 *     summary: Update the authenticated user's profile
 *     security: [{ bearerAuth: [] }]
 *     requestBody: { content: { multipart/form-data: { schema: { type: object, properties: { name: { type: string }, address: { type: string }, phoneNumber: { type: string }, avatar: { type: string, format: binary } } } } } }
 *     responses: { '200': { description: Profile updated successfully }, '400': { description: Validation failed } }
 */

profileRouter
  .route("/")
  .get(verifyToken, asyncHandler(getProfile))
  .delete(verifyToken, asyncHandler(deleteProfile))
  .patch(verifyToken, upload.single("avatar"), asyncHandler(updateProfile)); 

export { profileRouter };
