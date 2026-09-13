import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import type { UserRoleT } from "../utils/constants.js";

export const authorizeRoles = (...roles: UserRoleT[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    const validRole = roles.includes(req.user.role);
    if (!validRole) throw new AppError("Forbbiden", 403);

    next();
  };
};
