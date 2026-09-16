import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  classification,
  deletePlantDiseaseHistoryById,
  forecast,
  getPlantDiseaseHistoryById,
  plantDisease,
  plantDiseaseHistory,
  recommendation,
  recommendationHistory,
  recommendationHistoryDeleteById,
  simulation,
} from "../controllers/ai.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../config/multer.js";

const aiRouter = express.Router();

aiRouter
  .route("/classification")
  .post(verifyToken, asyncHandler(classification));

aiRouter.route("/forecast").post(verifyToken, asyncHandler(forecast));

aiRouter
  .route("/crop-growth-simulation")
  .post(verifyToken, asyncHandler(simulation));

aiRouter
  .route("/plant-disease")
  .post(verifyToken, upload.single("file"), asyncHandler(plantDisease));
aiRouter
  .route("/plant-disease/history")
  .get(verifyToken, asyncHandler(plantDiseaseHistory));
aiRouter
  .route("/plant-disease/history/:id")
  .get(verifyToken, asyncHandler(getPlantDiseaseHistoryById))
  .delete(verifyToken, asyncHandler(deletePlantDiseaseHistoryById));

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
