import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createCategory,
  deleteCategoryById,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../config/multer.js";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(asyncHandler(getCategories))
  .post(
    verifyToken,
    authorizeRoles("admin"),
    upload.single("categoryImage"),
    asyncHandler(createCategory),
  );

categoryRouter
  .route("/:categoryId")
  .get(asyncHandler(getCategoryById))
  .delete(
    verifyToken,
    authorizeRoles("admin"),
    asyncHandler(deleteCategoryById),
  )
  .patch(
    verifyToken,
    authorizeRoles("admin"),
    upload.single("categoryImage"),
    asyncHandler(updateCategory),
  );

export { categoryRouter };
