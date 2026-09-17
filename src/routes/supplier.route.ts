import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { userRoles } from "../utils/constants.js";

const supplierRouter = express.Router();

supplierRouter
  .route("/products")
  .get(verifyToken, authorizeRoles(userRoles.SUPPLIER))
  .post(verifyToken, authorizeRoles(userRoles.SUPPLIER));
supplierRouter
  .route("/products/:productId")
  .delete(verifyToken, authorizeRoles(userRoles.SUPPLIER));
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
