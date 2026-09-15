import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/helper.js";
import {
  locationReqSchema,
  simulationReqSchema,
} from "../schemas/ai.schema.js";
import { classificationService } from "../services/ai/classificationService.js";
import { forecastService } from "../services/ai/forecastService.js";
import { recommendationService } from "../services/ai/recommendationService.js";
import { AppError } from "../utils/appError.js";
import { cropRecommendation } from "../models/cropRecommendation.model.js";
import { simulationService } from "../services/ai/simulationService.js";

export const classification = async (req: Request, res: Response) => {
  const validatedReq = locationReqSchema.safeParse(req.body);

  if (!validatedReq.success) {
    return res.status(400).json(
      errorResponse(
        "Validation failed",
        validatedReq.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const validatedData = validatedReq.data;

  const result = await classificationService(validatedData);
  return res.status(200).json(successResponse(result.message, result.data));
};

export const forecast = async (req: Request, res: Response) => {
  const validatedReq = locationReqSchema.safeParse(req.body);

  if (!validatedReq.success) {
    return res.status(400).json(
      errorResponse(
        "Validation failed",
        validatedReq.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const validatedData = validatedReq.data;

  const result = await forecastService(validatedData);
  return res.status(200).json(successResponse(result.message, result.data));
};

export const recommendation = async (req: Request, res: Response) => {
  const validatedReq = locationReqSchema.safeParse(req.body);

  if (!validatedReq.success) {
    return res.status(400).json(
      errorResponse(
        "Validation failed",
        validatedReq.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const validatedData = validatedReq.data;
  const user = req.user;
  if (!user) throw new AppError("Not authenticated", 401);

  const result = await recommendationService({ data: validatedData, user });
  return res.status(200).json(successResponse(result.message, result.data));
};

export const recommendationHistory = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError("Not authenticated", 401);

  const recommendationHistory = await cropRecommendation.find(
    {
      userId: user.id,
    },
    { __v: false, userId: false },
  );

  if (!recommendationHistory) throw new AppError("History not found", 404);

  return res
    .status(200)
    .json(
      successResponse(
        "Recommendation history retrieved successfully",
        recommendationHistory,
      ),
    );
};

export const recommendationHistoryDeleteById = async (
  req: Request,
  res: Response,
) => {
  const historyId = req.params.id;
  if (!historyId) throw new AppError("Not valid history id", 400);

  await cropRecommendation.findByIdAndDelete(historyId);

  return res
    .status(200)
    .json(successResponse("Crop recommendation item deleted successfully"));
};

export const simulation = async (req: Request, res: Response) => {
  const validatedReq = simulationReqSchema.safeParse(req.body);

  if (!validatedReq.success) {
    return res.status(400).json(
      errorResponse(
        "Validation failed",
        validatedReq.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const validatedData = validatedReq.data;

  const result = await simulationService(validatedData);
  return res.status(200).json(successResponse(result.message, result.data));
};
