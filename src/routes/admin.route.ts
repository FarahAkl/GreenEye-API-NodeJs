import express from "express";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { userRoles } from "../utils/constants.js";
import {
  approveProduct,
  approveUser,
  changeRole,
  getProductById,
  getProducts,
  getUserById,
  getUsers,
  rejectProduct,
  rejectUser,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter
  .route("/users")
  .get(verifyToken, authorizeRoles(userRoles.ADMIN), asyncHandler(getUsers));
adminRouter
  .route("/users/:userId")
  .get(
    verifyToken,
    authorizeRoles(userRoles.ADMIN),
    asyncHandler(getUserById),
  );
adminRouter
  .route("/users/:userId/approve")
  .patch(
    verifyToken,
    authorizeRoles(userRoles.ADMIN),
    asyncHandler(approveUser),
  );
adminRouter
  .route("/users/:userId/reject")
  .patch(
    verifyToken,
    authorizeRoles(userRoles.ADMIN),
    asyncHandler(rejectUser),
  );
adminRouter
  .route("/users/:userId/change-role")
  .patch(
    verifyToken,
    authorizeRoles(userRoles.ADMIN),
    asyncHandler(changeRole),
  );
adminRouter
  .route("/users/:userId/freeze")
  .patch(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/users/:userId/unfreeze")
  .patch(verifyToken, authorizeRoles(userRoles.ADMIN));

adminRouter
  .route("/withdrawal-requests")
  .get(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/withdrawal-requests/:withdrawalId")
  .get(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/withdrawal-requests/:withdrawalId/approve")
  .patch(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/withdrawal-requests/:withdrawalId/reject")
  .patch(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/products")
  .get(verifyToken, authorizeRoles(userRoles.ADMIN), asyncHandler(getProducts));
adminRouter
  .route("/products/:productId")
  .get(
    verifyToken,
    authorizeRoles(userRoles.ADMIN),
    asyncHandler(getProductById),
  );
adminRouter
  .route("/products/:productId/approve")
  .patch(
    verifyToken,
    authorizeRoles(userRoles.ADMIN),
    asyncHandler(approveProduct),
  );
adminRouter
  .route("/products/:productId/reject")
  .patch(
    verifyToken,
    authorizeRoles(userRoles.ADMIN),
    asyncHandler(rejectProduct),
  );

adminRouter
  .route("/products-count")
  .get(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/orders-count")
  .get(verifyToken, authorizeRoles(userRoles.ADMIN));

adminRouter
  .route("/product-updates")
  .get(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/product-updates/:productId")
  .get(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/product-updates/:productId/approve")
  .patch(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/product-updates/:productId/reject")
  .patch(verifyToken, authorizeRoles(userRoles.ADMIN));

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List users
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer, minimum: 1 } }
 *       - { name: limit, in: query, schema: { type: integer, minimum: 1, maximum: 100 } }
 *       - { name: role, in: query, schema: { type: string } }
 *       - { name: status, in: query, schema: { type: string, enum: [pending, approved, rejected] } }
 *     responses: { '200': { description: Users retrieved successfully }, '400': { description: Invalid query parameters }, '403': { description: Admin role required } }
 * /api/admin/users/{userId}:
 *   get:
 *     tags: [Admin]
 *     summary: Get user by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: userId, in: path, required: true, schema: { type: string } }]
 *     responses: { '200': { description: User retrieved successfully }, '404': { description: User not found }}
 * /api/admin/users/{userId}/approve:
 *   patch:
 *     tags: [Admin]
 *     summary: Approve a pending user
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: userId, in: path, required: true, schema: { type: string } }]
 *     responses: { '200': { description: User approved successfully }, '404': { description: User not found }, '409': { description: User is not pending } }
 * /api/admin/users/{userId}/reject:
 *   patch:
 *     tags: [Admin]
 *     summary: Reject a pending user
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: userId, in: path, required: true, schema: { type: string } }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, required: [rejectReason], properties: { rejectReason: { type: string, minLength: 1 } } } } } }
 *     responses: { '200': { description: User rejected successfully }, '400': { description: Validation failed }, '409': { description: User is not pending } }
 * /api/admin/users/{userId}/change-role:
 *   patch:
 *     tags: [Admin]
 *     summary: Change a user's role
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: userId, in: path, required: true, schema: { type: string } }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, required: [role], properties: { role: { type: string } } } } } }
 *     responses: { '200': { description: User's role changed successfully }, '409': { description: User already has this role } }
 * /api/admin/products:
 *   get:
 *     tags: [Admin]
 *     summary: List the products
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer, minimum: 1 } }
 *       - { name: limit, in: query, schema: { type: integer, minimum: 1, maximum: 100 } }
 *       - { name: status, in: query, schema: { type: string, enum: [pending, approved, rejected] } }
 *       - { name: category, in: query, schema: { type: string } }
 *       - { name: search, in: query, schema: { type: string } }
 *       - { name: minPrice, in: query, schema: { type: number, minimum: 0 } }
 *       - { name: maxPrice, in: query, schema: { type: number, minimum: 0 } }
 *       - { name: sortPrice, in: query, schema: { type: string, enum: [asc, desc] } }
 *     responses: { '200': { description: Products retrieved successfully }, '400': { description: Invalid query parameters } }
 * /api/admin/products/{productId}:
 *   get:
 *     summary: Get product by ID
 *     security: [{ bearerAuth: [] }]
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully.
 *       400:
 *         description: Product ID is required.
 *       404:
 *         description: Product not found.
 * /api/admin/products/{productId}/approve:
 *   patch:
 *     tags: [Admin]
 *     summary: Approve a pending product
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: productId, in: path, required: true, schema: { type: string } }]
 *     responses: { '200': { description: Product approved successfully }, '404': { description: Product not found }, '409': { description: Product is not pending } }
 * /api/admin/products/{productId}/reject:
 *   patch:
 *     tags: [Admin]
 *     summary: Reject a pending product
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: productId, in: path, required: true, schema: { type: string } }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, required: [rejectReason], properties: { rejectReason: { type: string, minLength: 1 } } } } } }
 *     responses: { '200': { description: Product rejected successfully }, '400': { description: Validation failed }, '409': { description: Product is not pending } }
 */

export { adminRouter };
