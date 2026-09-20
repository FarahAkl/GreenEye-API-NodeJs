import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { userRoles } from "../utils/constants.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createProduct,
  deleteProductById,
  getSupplierProducts,
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
  .post(verifyToken, authorizeRoles(userRoles.SUPPLIER));
supplierRouter
  .route("/products-in-orders")
  .get(verifyToken, authorizeRoles(userRoles.SUPPLIER));
supplierRouter
  .route("/profits")
  .get(verifyToken, authorizeRoles(userRoles.SUPPLIER));

export { supplierRouter };
