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

profileRouter
  .route("/")
  .get(verifyToken, asyncHandler(getProfile))
  .delete(verifyToken, asyncHandler(deleteProfile))
  .patch(verifyToken, upload.single("avatar"), asyncHandler(updateProfile)); 

export { profileRouter };
