import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/helper.js";
import {
  locationReqSchema,
  plantDiseaseResSchema,
  simulationReqSchema,
} from "../schemas/ai.schema.js";
import { classificationService } from "../services/ai/classificationService.js";
import { forecastService } from "../services/ai/forecastService.js";
import { recommendationService } from "../services/ai/recommendationService.js";
import { AppError } from "../utils/appError.js";
import { cropRecommendation } from "../models/cropRecommendation.model.js";
import { simulationService } from "../services/ai/simulationService.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { axiosInstance } from "../config/axios.js";
import { plantDiseaseModel } from "../models/plantDisease.model.js";

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

export const plantDisease = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError("Not authenticated", 401);

  const file = req.file;
  if (!file) throw new AppError("Plant image is required", 400);

  const plantDiseaseApi = process.env.PLANT_DISEASE_MODEL_API;
  if (!plantDiseaseApi) {
    throw new AppError("Plant disease API is not configured", 500);
  }

  const formData = new FormData();

  formData.append(
    "file",
    new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }),
    file.originalname,
  );
  const plantDiseaseRes = await axiosInstance.post(plantDiseaseApi, formData);

  const validPlantDiseaseRes = plantDiseaseResSchema.safeParse(
    plantDiseaseRes.data,
  );
  if (!validPlantDiseaseRes.success)
    throw new AppError("Invalid response from plant disease API", 502);

  const result = await uploadToCloudinary(file.buffer);
  const fileUrl = result.secure_url;

  const { confidence, cause, treatment } = validPlantDiseaseRes.data;

  await plantDiseaseModel.create({
    userId: user.id,
    plantImage: fileUrl,
    plantDisease: validPlantDiseaseRes.data.class,
    confidence,
    cause,
    treatment,
  });

  return res
    .status(200)
    .json(
      successResponse(
        "Plant disease detected successfully",
        validPlantDiseaseRes.data,
      ),
    );
};

export const plantDiseaseHistory = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError("Not authenticated", 401);

  const history = await plantDiseaseModel.find(
    { userId: user.id },
    { __v: false, userId: false },
  );
  if (!history) throw new AppError("Can not retrieve history", 500);

  return res
    .status(200)
    .json(
      successResponse("Plant disease history retrieved successfully", history),
    );
};

export const getPlantDiseaseHistoryById = async (
  req: Request,
  res: Response,
) => {
  const user = req.user;
  if (!user) throw new AppError("Not authenticated", 401);

  const id = req.params.id;
  if (!id) throw new AppError("Not valid Id", 400);

  const history = await plantDiseaseModel.findOne(
    {
      _id: id,
      userId: user.id,
    },
    {
      __v: false,
      userId: false,
    },
  );
  if (!history) throw new AppError("History not found", 404);

  return res
    .status(200)
    .json(
      successResponse("Plant disease history retrieved successfully", history),
    );
};

export const deletePlantDiseaseHistoryById = async (
  req: Request,
  res: Response,
) => {
  const user = req.user;
  if (!user) throw new AppError("Not authenticated", 401);

  const id = req.params.id;
  if (!id) throw new AppError("Not valid Id", 400);

  await plantDiseaseModel.findOneAndDelete(
    {
      _id: id,
      userId: user.id,
    }
  );

  return res
    .status(200)
    .json(
      successResponse("Plant disease history deleted successfully"),
    );
};
