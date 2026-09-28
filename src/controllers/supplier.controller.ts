import type { Request, Response } from "express";
import {
  buildProductFilter,
  errorResponse,
  successResponse,
} from "../utils/helper.js";
import { product } from "../models/product.model.js";
import { AppError } from "../utils/appError.js";
import { getPagination, paginate } from "../utils/pagination.js";
import {
  createProductReqSchema,
  updateProductReqSchema,
} from "../schemas/supplier.schema.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { category } from "../models/category.model.js";
import { productFilterSchema } from "../schemas/product.schema.js";
import { productUpdates } from "../models/productsUpdate.model.js";

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
  const { filter, sort } = buildProductFilter(filters);
  const products = await paginate(
    product,
    { supplierId: user.id, ...filter },
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

export const updateProduct = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError("Not Authenticated", 401);
  const supplierId = user.id;

  const cleanedBody = Object.fromEntries(
    Object.entries(req.body).filter(([, value]) => value !== ""),
  );

  const validatedReq = updateProductReqSchema.safeParse(cleanedBody);

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
  const productId = req.params.productId as string;
  if (!productId) throw new AppError("Product id is required", 400);

  const productExisted = await product.findById(productId);
  if (!productExisted) throw new AppError("Product not found", 404);

  if (productExisted.supplierId !== supplierId) {
    throw new AppError("Product not found or not authorized", 404);
  }

  const existingUpdate = await productUpdates.findOne({ productId });

  if (existingUpdate) {
    throw new AppError(
      "There is already a pending update request for this product",
      409,
    );
  }

  const images = req.files as Express.Multer.File[];
  let imageUrls: string[] | undefined;
  if (images?.length) {
    imageUrls = await Promise.all(
      images.map(async (image) => {
        const result = await uploadToCloudinary(
          image.buffer,
          "greeneye/products",
        );

        return result.secure_url;
      }),
    );
  }

  if (validatedData.categoryId) {
    const categoryExist = await category.findById(validatedData.categoryId);
    if (!categoryExist) throw new AppError("Category not exists", 400);
  }

  const updatePayload = {
    productId,
    supplierId,
    ...(validatedData.productName !== undefined
      ? { productName: validatedData.productName }
      : {}),
    ...(validatedData.description !== undefined
      ? { description: validatedData.description }
      : {}),
    ...(validatedData.price !== undefined
      ? { price: validatedData.price }
      : {}),
    ...(validatedData.categoryId !== undefined
      ? { categoryId: validatedData.categoryId }
      : {}),
    ...(validatedData.quantity !== undefined
      ? { quantity: validatedData.quantity }
      : {}),
    ...(validatedData.productionDate !== undefined
      ? { productionDate: validatedData.productionDate }
      : {}),
    ...(validatedData.expiryDate !== undefined
      ? { expiryDate: validatedData.expiryDate }
      : {}),
    ...(imageUrls?.length ? { images: imageUrls } : {}),
  };

  await productUpdates.create(updatePayload);

  return res
    .status(201)
    .json(successResponse("Product update request sent successfully"));
};
