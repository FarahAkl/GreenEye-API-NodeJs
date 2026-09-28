import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import type { AuthPayload } from "../types/auth.js";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return next(new AppError("Not authenticated", 401));

  const jwtAccessSecret = process.env.JWT_ACCESS_SECRET_KEY;
  if (!jwtAccessSecret)
    return next(new AppError("JWT secret is not configured", 500));

  let decodedToken: string | jwt.JwtPayload;

  try {
    decodedToken = jwt.verify(accessToken, jwtAccessSecret);
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }

  if (
    typeof decodedToken === "string" ||
    typeof decodedToken.id !== "string" ||
    typeof decodedToken.email !== "string" ||
    typeof decodedToken.role !== "string"
  ) {
    return next(new AppError("Invalid token", 401));
  }

  const user: AuthPayload = {
    id: decodedToken.id,
    email: decodedToken.email,
    role: decodedToken.role as AuthPayload["role"],
  };

  req.user = user;

  next();
};
