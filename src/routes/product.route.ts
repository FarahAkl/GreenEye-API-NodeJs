import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getProductById,
  getProducts,
} from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.route("/").get(asyncHandler(getProducts));

productRouter.route("/:productId").get(asyncHandler(getProductById));

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Product]
 *     summary: List the products
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer, minimum: 1 } }
 *       - { name: limit, in: query, schema: { type: integer, minimum: 1, maximum: 100 } }
 *       - { name: category, in: query, schema: { type: string } }
 *       - { name: search, in: query, schema: { type: string } }
 *       - { name: minPrice, in: query, schema: { type: number, minimum: 0 } }
 *       - { name: maxPrice, in: query, schema: { type: number, minimum: 0 } }
 *       - { name: sortPrice, in: query, schema: { type: string, enum: [asc, desc] } }
 *     responses: { '200': { description: Products retrieved successfully }, '400': { description: Invalid query parameters } }
 * /api/products/{productId}:
 *   get:
 *     summary: Get product by ID
 *     tags:
 *       - Product
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
 */

export { productRouter };
