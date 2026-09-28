import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { userRoles } from "../utils/constants.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createProduct,
  deleteProductById,
  getSupplierProducts,
  updateProduct,
} from "../controllers/supplier.controller.js";
import { upload } from "../config/multer.js";

const supplierRouter = express.Router();

supplierRouter
  .route("/products")
  .get(
    verifyToken,
    authorizeRoles(userRoles.SUPPLIER),
    asyncHandler(getSupplierProducts),
  )
  .post(
    verifyToken,
    authorizeRoles(userRoles.SUPPLIER),
    upload.array("images"),
    asyncHandler(createProduct),
  );
supplierRouter
  .route("/products/:productId")
  .delete(
    verifyToken,
    authorizeRoles(userRoles.SUPPLIER),
    asyncHandler(deleteProductById),
  );
supplierRouter
  .route("/product-updates/:productId")
  .post(
    verifyToken,
    authorizeRoles(userRoles.SUPPLIER),
    upload.array("images"),
    asyncHandler(updateProduct),
  );
supplierRouter
  .route("/products-in-orders")
  .get(verifyToken, authorizeRoles(userRoles.SUPPLIER));
supplierRouter
  .route("/profits")
  .get(verifyToken, authorizeRoles(userRoles.SUPPLIER));

/**
 * @swagger
 * /api/supplier/products:
 *   get:
 *     tags: [Supplier]
 *     summary: List the authenticated supplier's products (Supplier only)
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
 *   post:
 *     tags: [Supplier]
 *     summary: Create a product (Supplier only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody: { required: true, content: { multipart/form-data: { schema: { type: object, required: [productName, description, price, categoryId, quantity, productionDate, expiryDate, images], properties: { productName: { type: string }, description: { type: string }, price: { type: number, minimum: 1 }, categoryId: { type: string }, quantity: { type: integer, minimum: 1 }, productionDate: { type: string, format: date-time }, expiryDate: { type: string, format: date-time }, images: { type: array, items: { type: string, format: binary } } } } } } }
 *     responses: { '201': { description: Product created successfully }, '400': { description: Validation failed or images missing }, '404': { description: Category not found } }
 * /api/supplier/products/{productId}:
 *   delete:
 *     tags: [Supplier]
 *     summary: Delete one of the authenticated supplier's products
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: productId, in: path, required: true, schema: { type: string } }]
 *     responses: { '200': { description: Product deleted successfully }, '404': { description: Product not found } }
 * /api/supplier/product-updates/{productId}:
 *   post:
 *     summary: Request product update
 *     tags:
 *       - Supplier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 example: Organic Rice
 *               description:
 *                 type: string
 *                 example: High-quality organic rice
 *               price:
 *                 type: number
 *                 example: 250
 *               categoryId:
 *                 type: string
 *                 example: 65f123456789abcdef123456
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               productionDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-09-01
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2027-09-01
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images
 *     responses:
 *       201:
 *         description: Product update request sent successfully
 *       400:
 *         description: Validation failed or invalid category/product ID
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Supplier is not allowed to update this product
 *       404:
 *         description: Product not found
 *       409:
 *         description: There is already a pending update request
 */

export { supplierRouter };
