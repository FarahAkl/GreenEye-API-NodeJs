import type { Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import {
  buildProductFilter,
  errorResponse,
  successResponse,
} from "../utils/helper.js";
import { getPagination, paginate } from "../utils/pagination.js";
import { userModel } from "../models/user.model.js";
import {
  rejectReasonSchema,
  userChangeRoleReqSchema,
  usersQuerySchema,
} from "../schemas/admin.schema.js";
import { rejectUserService } from "../services/admin/rejectUserService.js";
import { productFilterSchema } from "../schemas/product.schema.js";
import { product } from "../models/product.model.js";
import { rejectProductService } from "../services/admin/rejectProductService.js";
import { category } from "../models/category.model.js";

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

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) throw new AppError("User is is required", 400);

  const user = await userModel.findById(userId).select("-__v -password");
  if (!user) throw new AppError("User not found", 404);

  return res
    .status(200)
    .json(successResponse("User retrieved successfully", user));
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

export const getProducts = async (req: Request, res: Response) => {
  const validatedQuery = productFilterSchema.safeParse(req.query);

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

  const { page = 1, limit = 10, ...filters } = validatedQuery.data;
  const pagination = getPagination({
    page,
    limit,
  });
  const { filter, sort } = buildProductFilter(filters);
  const products = await paginate(
    product,
    { ...filter },
    {
      ...pagination,
      select: "-__v",
      ...(sort !== undefined ? { sort } : {}),
    },
  );

  return res
    .status(200)
    .json(
      successResponse(
        "Products retrieved successfully",
        products.data,
        products.pagination,
      ),
    );
};

export const getProductById = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  if (!productId) throw new AppError("Product id is required", 400);

  const productData = await product.findById(productId).select("-__v").lean();

  if (!productData) throw new AppError("Product not found", 404);
  const categoryData = await category
    .findById(productData.categoryId)
    .select("-__v")
    .lean();
  if (!categoryData) throw new AppError("Category not found", 404);

  const supplier = await userModel
    .findById(productData.supplierId)
    .select("-__v -password")
    .lean();
  if (!supplier) throw new AppError("Supplier not found", 404);

  const { categoryId, supplierId, ...productInfo } = productData;

  return res.status(200).json(
    successResponse("Product retrieved successfully", {
      ...productInfo,
      category: categoryData,
      supplier: supplier,
    }),
  );
};

export const approveProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  if (!productId) throw new AppError("Product id is required", 400);
  const productData = await product.findById(productId);

  if (!productData) {
    throw new AppError("Product not found", 404);
  }

  if (productData.status !== "pending") {
    throw new AppError(
      `Product cannot be approved because its status is ${productData.status}`,
      409,
    );
  }
  await product.findByIdAndUpdate(productId, { status: "approved" });

  return res.status(200).json(successResponse("Product approved successfully"));
};

export const rejectProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId as string;
  if (!productId) throw new AppError("Product id is required", 400);
  const productData = await product.findById(productId);

  if (!productData) {
    throw new AppError("Product not found", 404);
  }

  if (productData.status !== "pending") {
    throw new AppError(
      `Product cannot be rejected because its status is ${productData.status}`,
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

  const user = await userModel.findById(productData.supplierId);
  if (!user) throw new AppError("Supplier not found", 404);

  const validatedData = validatedReq.data;

  const result = await rejectProductService({
    productId,
    productName: productData.productName,
    email: user.email,
    userName: user.name,
    rejectReason: validatedData.rejectReason,
  });

  return res.status(200).json(successResponse(result.message));
};
