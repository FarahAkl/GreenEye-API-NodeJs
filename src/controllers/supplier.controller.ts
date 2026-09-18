import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/helper.js";
import { product } from "../models/product.model.js";
import { AppError } from "../utils/appError.js";
import { getPagination, paginate } from "../utils/pagination.js";
import { createProductReqSchema } from "../schemas/supplier.schema.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { category } from "../models/category.model.js";

export const getSupplierProducts = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError("Not authenticated", 401);
  const { page, limit } = getPagination({
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  });
  const filter = { supplierId: user.id };
  const products = await paginate(product, filter, {
    page,
    limit,
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
  if (!user) throw new AppError("Not authenticated", 401);

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

  const images = req.files as Express.Multer.File[];
  if (!images.length) throw new AppError("At least one image is required", 400);
  if (images.length > 5)
    throw new AppError("Maximum number of images is 5", 400);

  const imageUrls = await Promise.all(
    images.map(async (image, index) => {
      const result = await uploadToCloudinary(image.buffer);
      return result.secure_url;
    }),
  );

  const validatedData = validatedReq.data;

  const existingCategory = await category.findById(validatedData.categoryId);
  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  const productData = await product.create({
    ...validatedData,
    images: imageUrls,
    supplierId: user.id,
  });

  return res
    .status(200)
    .json(successResponse("Product created successfully", productData));
};
