import type { Request, Response } from "express";
import {
  buildProductFilter,
  errorResponse,
  successResponse,
} from "../utils/helper.js";
import { product } from "../models/product.model.js";
import { AppError } from "../utils/appError.js";
import { getPagination, paginate } from "../utils/pagination.js";
import { createProductReqSchema } from "../schemas/supplier.schema.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { category } from "../models/category.model.js";
import { productFilterSchema } from "../schemas/product.schema.js";

export const getSupplierProducts = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError("Not authenticated", 401);

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
  const filter = { supplierId: user.id, ...buildProductFilter(filters) };
  const products = await paginate(product, filter, {
    ...pagination,
    select: "-__v",
  });

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

export const createProduct = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new AppError("Not authenticated", 401);
  }

  const validatedReq = createProductReqSchema.safeParse(req.body);

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

  const images = req.files;

  if (!Array.isArray(images) || images.length === 0) {
    throw new AppError("At least one image is required", 400);
  }

  if (images.length > 5) {
    throw new AppError("Maximum number of images is 5", 400);
  }

  const validatedData = validatedReq.data;

  const existingCategory = await category.findById(validatedData.categoryId);

  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  const imageUrls = await Promise.all(
    images.map(async (image) => {
      const result = await uploadToCloudinary(
        image.buffer,
        "greeneye/products",
      );

      return result.secure_url;
    }),
  );

  const productData = await product.create({
    ...validatedData,
    images: imageUrls,
    supplierId: user.id,
  });

  return res
    .status(201)
    .json(successResponse("Product created successfully", productData));
};

export const deleteProductById = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError("Not authenticated", 401);

  const id = req.params.productId;
  if (!id) throw new AppError("Product id is required", 400);

  const existingProduct = await product.findOne({
    _id: id,
    supplierId: user.id,
  });
  if (!existingProduct) throw new AppError("Product not found", 404);

  await product.findByIdAndDelete(id);

  return res.status(200).json(successResponse("Product deleted successfully"));
};
