import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/helper.js";
import { locationReqSchema } from "../schemas/ai.schema.js";
import { classificationService } from "../services/ai/classificationService.js";
import { forecastService } from "../services/ai/forecastService.js";

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
