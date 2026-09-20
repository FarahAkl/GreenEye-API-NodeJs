import type { Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { errorResponse, successResponse } from "../utils/helper.js";
import { getPagination, paginate } from "../utils/pagination.js";
import { userModel } from "../models/user.model.js";
import {
  rejectReasonSchema,
  userChangeRoleReqSchema,
  usersQuerySchema,
} from "../schemas/admin.schema.js";
import { rejectUserService } from "../services/admin/rejectUserService.js";

export const getUsers = async (req: Request, res: Response) => {
  const validatedQuery = usersQuerySchema.safeParse(req.query);

  if (!validatedQuery.success) {
    return res.status(400).json(
      errorResponse(
        "Invalid query parameters",
        validatedQuery.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      ),
    );
  }

  const { page = 1, limit = 10, role, status } = validatedQuery.data;
  const pagination = getPagination({
    page,
    limit,
  });
  const filter = {
    ...(role ? { role } : {}),
    ...(status ? { status } : {}),
  };

  const usersData = await paginate(userModel, filter, {
    ...pagination,
    select: "-__v -password",
  });

  return res
    .status(200)
    .json(
      successResponse(
        "Users retrieved successfully",
        usersData.data,
        usersData.pagination,
      ),
    );
};

export const approveUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) throw new AppError("User id is required", 400);
  const user = await userModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.status !== "pending") {
    throw new AppError(
      `User cannot be approved because its status is ${user.status}`,
      409,
    );
  }
  await userModel.findByIdAndUpdate(userId, { status: "approved" });

  return res.status(200).json(successResponse("User approved successfully"));
};

export const rejectUser = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  if (!userId) throw new AppError("User id is required", 400);
  const user = await userModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.status !== "pending") {
    throw new AppError(
      `User cannot be rejected because its status is ${user.status}`,
      409,
    );
  }
  const validatedReq = rejectReasonSchema.safeParse(req.body);

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

  const result = await rejectUserService({
    userId,
    rejectReason: validatedData.rejectReason,
    email: user.email,
    userName: user.name,
  });

  return res.status(200).json(successResponse(result.message));
};

export const changeRole = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) throw new AppError("User id is required", 400);
  const user = await userModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const validatedReq = userChangeRoleReqSchema.safeParse(req.body);

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

  if (user.role === validatedData.role) {
    throw new AppError("User already has this role", 409);
  }

  await userModel.findByIdAndUpdate(userId, validatedData);

  return res
    .status(200)
    .json(successResponse("User's role changed successfully"));
};
