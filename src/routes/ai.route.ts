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

/**
 * @swagger
 * /api/ai/classification:
 *   post:
 *     tags: [AI]
 *     summary: Classify desertification for a location
 *     security: [{ bearerAuth: [] }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, required: [longitude, latitude], properties: { longitude: { type: number, example: 31.04 }, latitude: { type: number, example: 30.99 } } } } } }
 *     responses: { '200': { description: Classification returned }, '400': { description: Validation failed }, '401': { description: Not authenticated } }
 */

aiRouter
  .route("/classification")
  .post(verifyToken, asyncHandler(classification));

aiRouter.route("/forecast").post(verifyToken, asyncHandler(forecast));

/** @swagger
 * /api/ai/forecast:
 *   post:
 *     tags: [AI]
 *     summary: Generate a location forecast
 *     security: [{ bearerAuth: [] }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, required: [longitude, latitude], properties: { longitude: { type: number }, latitude: { type: number } } } } } }
 *     responses: { '200': { description: Forecast returned }, '400': { description: Validation failed } }
 */

/**
 * @swagger
 * /api/ai/crop-growth-simulation:
 *   post:
 *     tags: [AI]
 *     summary: Run a crop-growth simulation
 *     description: Requires an authenticated user and a crop name with the target location.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [latitude, longitude, cropName]
 *             properties:
 *               latitude: { type: number, example: 30.99 }
 *               longitude: { type: number, example: 31.04 }
 *               cropName: { type: string, example: wheat }
 *     responses:
 *       '200': { description: Simulation result returned }
 *       '400': { description: Validation failed }
 *       '401': { description: Not authenticated }
 */
aiRouter
  .route("/crop-growth-simulation")
  .post(verifyToken, asyncHandler(simulation));

/** @swagger
 * /api/ai/plant-disease:
 *   post:
 *     tags: [AI]
 *     summary: Detect disease in a plant image
 *     security: [{ bearerAuth: [] }]
 *     requestBody: { required: true, content: { multipart/form-data: { schema: { type: object, required: [file], properties: { file: { type: string, format: binary } } } } } }
 *     responses: { '200': { description: Disease analysis returned }, '400': { description: Plant image is required } }
 */

aiRouter
  .route("/plant-disease")
  .post(verifyToken, upload.single("file"), asyncHandler(plantDisease));
aiRouter
  .route("/plant-disease/history")
  .get(verifyToken, asyncHandler(plantDiseaseHistory));

/** @swagger
 * /api/ai/plant-disease/history:
 *   get:
 *     tags: [AI]
 *     summary: List the authenticated user's plant-disease history
 *     security: [{ bearerAuth: [] }]
 *     responses: { '200': { description: History returned } }
 * /api/ai/plant-disease/history/{id}:
 *   get:
 *     tags: [AI]
 *     summary: Get a plant-disease history item
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses: { '200': { description: History item returned } }
 *   delete:
 *     tags: [AI]
 *     summary: Delete a plant-disease history item
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses: { '200': { description: History item deleted } }
 */
aiRouter
  .route("/plant-disease/history/:id")
  .get(verifyToken, asyncHandler(getPlantDiseaseHistoryById))
  .delete(verifyToken, asyncHandler(deletePlantDiseaseHistoryById));

aiRouter
  .route("/crop-recommendation")
  .post(verifyToken, asyncHandler(recommendation));

/** @swagger
 * /api/ai/crop-recommendation:
 *   post:
 *     tags: [AI]
 *     summary: Generate crop recommendations for a location
 *     security: [{ bearerAuth: [] }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object, required: [longitude, latitude], properties: { longitude: { type: number }, latitude: { type: number } } } } } }
 *     responses: { '200': { description: Recommendations returned } }
 * /api/ai/crop-recommendation/history:
 *   get:
 *     tags: [AI]
 *     summary: List crop-recommendation history
 *     security: [{ bearerAuth: [] }]
 *     responses: { '200': { description: History returned } }
 * /api/ai/crop-recommendation/history/{id}:
 *   delete:
 *     tags: [AI]
 *     summary: Delete a crop-recommendation history item
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses: { '200': { description: History item deleted } }
 */
aiRouter
  .route("/crop-recommendation/history")
  .get(verifyToken, asyncHandler(recommendationHistory));
aiRouter
  .route("/crop-recommendation/history/:id")
  .delete(verifyToken, asyncHandler(recommendationHistoryDeleteById));

export { aiRouter };
