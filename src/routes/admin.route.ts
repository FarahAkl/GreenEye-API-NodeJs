import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { userRoles } from "../utils/constants.js";

const adminRouter = express.Router();

adminRouter.route("/users").get(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/users/:userId/approve")
  .patch(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/users/:userId/reject")
  .patch(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/users/:userId/change-role")
  .patch(verifyToken, authorizeRoles(userRoles.ADMIN));
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
  .get(verifyToken, authorizeRoles(userRoles.ADMIN));

adminRouter
  .route("/products/:productId/approve")
  .patch(verifyToken, authorizeRoles(userRoles.ADMIN));
adminRouter
  .route("/products/:productId/reject")
  .patch(verifyToken, authorizeRoles(userRoles.ADMIN));

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

export { adminRouter };
