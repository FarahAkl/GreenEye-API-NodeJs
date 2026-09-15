import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  classification,
  forecast,
  recommendation,
  recommendationHistory,
  recommendationHistoryDeleteById,
  simulation,
} from "../controllers/ai.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const aiRouter = express.Router();

aiRouter
  .route("/classification")
  .post(verifyToken, asyncHandler(classification));

aiRouter.route("/forecast").post(verifyToken, asyncHandler(forecast));

aiRouter
  .route("/crop-growth-simulation")
  .post(verifyToken, asyncHandler(simulation));

// aiRouter.route("/crop-disease").post();
// aiRouter.route("/crop-disease/history").get();
// aiRouter.route("/crop-disease/history/:id").delete().get();

aiRouter
  .route("/crop-recommendation")
  .post(verifyToken, asyncHandler(recommendation));
aiRouter
  .route("/crop-recommendation/history")
  .get(verifyToken, asyncHandler(recommendationHistory));
aiRouter
  .route("/crop-recommendation/history/:id")
  .delete(verifyToken, asyncHandler(recommendationHistoryDeleteById));

export { aiRouter };
