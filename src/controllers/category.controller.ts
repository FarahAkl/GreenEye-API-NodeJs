import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/helper.js";
import { category } from "../models/category.model.js";
import { AppError } from "../utils/appError.js";
import {
  createCategoryReqSchema,
  updateCategoryReqSchema,
} from "../schemas/category.schema.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const getCategories = async (req: Request, res: Response) => {
  const categories = await category.find({}, { __v: false });
  if (!categories) throw new AppError("Categories not found", 404);

  return res
    .status(200)
    .json(successResponse("Categories retrieved successfully", categories));
};

export const createCategory = async (req: Request, res: Response) => {
  const validatedReq = createCategoryReqSchema.safeParse(req.body);

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

  const categoryImage = req.file;
  if (!categoryImage) throw new AppError("Category image is required", 400);

  const result = await uploadToCloudinary(categoryImage.buffer);
  const imageUrl = result.secure_url;
  console.log(req.user);

  await category.create({
    ...validatedData,
    imageUrl,
  });

  return res.status(201).json(successResponse("Category created successfully"));
};

export const getCategoryById = async (req: Request, res: Response) => {
  const id = req.params.categoryId;
  if (!id) throw new AppError("Id is required", 400);
  const categoryData = await category.findById(id, { __v: false });
  if (!categoryData) throw new AppError("Category not found", 404);

  return res
    .status(200)
    .json(successResponse("Category retrieved successfully", categoryData));
};

export const deleteCategoryById = async (req: Request, res: Response) => {
  const id = req.params.categoryId;
  if (!id) throw new AppError("Id is required", 400);

  await category.findByIdAndDelete(id);

  return res.status(200).json(successResponse("Category deleted successfully"));
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.categoryId;

  if (!id) {
    throw new AppError("Category id is required", 400);
  }

  const validatedReq = updateCategoryReqSchema.safeParse(req.body);

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

  let imageUrl: string | undefined;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);

    imageUrl = result.secure_url;
  }

  const updatedCategory = await category
    .findByIdAndUpdate(
      id,
      {
        ...validatedReq.data,
        ...(imageUrl ? { imageUrl } : {}),
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    )
    .select("-__v");

  if (!updatedCategory) {
    throw new AppError("Category not found", 404);
  }

  return res
    .status(200)
    .json(successResponse("Category updated successfully", updatedCategory));
};
