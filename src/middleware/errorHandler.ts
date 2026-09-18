import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { AppError } from "../utils/appError.js";
import { errorResponse } from "../utils/helper.js";
import multer from "multer";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(errorResponse(error.message));
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json(errorResponse("Image size must not exceed 5 MB", null));
    }
  }
  console.error(error);

  return res.status(500).json(errorResponse("Internal server error"));
};
