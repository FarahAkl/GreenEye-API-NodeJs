import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { errorResponse } from "../utils/helper.js";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(errorResponse(error.message));
  }

  console.error(error);

  return res.status(500).json(errorResponse("Internal server error"));
};
