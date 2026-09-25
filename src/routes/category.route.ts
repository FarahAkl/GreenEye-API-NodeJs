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
import { userRoles } from "../utils/constants.js";

const categoryRouter = express.Router();

/**
 * @swagger
 * /api/marketplace/category:
 *   get:
 *     tags: [Category]
 *     summary: List categories
 *     responses: { '200': { description: Categories retrieved successfully } }
 *   post:
 *     tags: [Category]
 *     summary: Create a category (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody: { required: true, content: { multipart/form-data: { schema: { type: object, required: [categoryName, description], properties: { categoryName: { type: string }, description: { type: string }, categoryImage: { type: string, format: binary } } } } } }
 *     responses: { '201': { description: Category created successfully }, '400': { description: Validation failed }, '403': { description: Admin role required } }
 * /api/marketplace/category/{categoryId}:
 *   get:
 *     tags: [Category]
 *     summary: Get a category
 *     parameters: [{ name: categoryId, in: path, required: true, schema: { type: string } }]
 *     responses: { '200': { description: Category retrieved successfully }, '404': { description: Category not found } }
 *   delete:
 *     tags: [Category]
 *     summary: Delete a category (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: categoryId, in: path, required: true, schema: { type: string } }]
 *     responses: { '200': { description: Category deleted successfully }, '409': { description: Category contains products } }
 *   patch:
 *     tags: [Category]
 *     summary: Update a category (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: categoryId, in: path, required: true, schema: { type: string } }]
 *     requestBody: { content: { multipart/form-data: { schema: { type: object, properties: { categoryName: { type: string }, description: { type: string }, categoryImage: { type: string, format: binary } } } } } }
 *     responses: { '200': { description: Category updated successfully }, '404': { description: Category not found } }
 */

categoryRouter
  .route("/")
  .get(asyncHandler(getCategories))
  .post(
    verifyToken,
    authorizeRoles(userRoles.ADMIN),
    upload.single("categoryImage"),
    asyncHandler(createCategory),
  );

categoryRouter
  .route("/:categoryId")
  .get(asyncHandler(getCategoryById))
  .delete(
    verifyToken,
    authorizeRoles(userRoles.ADMIN),
    asyncHandler(deleteCategoryById),
  )
  .patch(
    verifyToken,
    authorizeRoles(userRoles.ADMIN),
    upload.single("categoryImage"),
    asyncHandler(updateCategory),
  );

export { categoryRouter };
