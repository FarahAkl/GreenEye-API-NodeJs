import type { Request, Response } from "express";
import { product } from "../models/product.model.js";
import {
  buildProductFilter,
  errorResponse,
  successResponse,
} from "../utils/helper.js";
import { getPagination, paginate } from "../utils/pagination.js";
import { AppError } from "../utils/appError.js";
import { productFilterSchema } from "../schemas/product.schema.js";
import { userModel } from "../models/user.model.js";
import { category } from "../models/category.model.js";

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
    { ...filter, status: "approved" },
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

  const productData = await product
    .findOne({ _id: productId, status: "approved" })
    .select("-__v")
    .lean();
  if (!productData) throw new AppError("Product not found", 404);

  const [categoryData, supplier] = await Promise.all([
    category.findById(productData.categoryId).select("-__v").lean(),
    userModel.findById(productData.supplierId).select("-__v -password").lean(),
  ]);

  if (!categoryData) throw new AppError("Category not found", 404);
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
