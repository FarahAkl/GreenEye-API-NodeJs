import type { Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { errorResponse, successResponse } from "../utils/helper.js";
import { getPagination, paginate } from "../utils/pagination.js";
import { userModel } from "../models/user.model.js";
import { usersQuerySchema } from "../schemas/admin.schema.js";

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
