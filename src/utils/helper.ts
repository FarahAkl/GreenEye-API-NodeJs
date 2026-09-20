import type { productFilterT } from "../schemas/product.schema.js";
import type { ApiResponse, PaginationT } from "../types/response.js";

export const successResponse = <T>(
  message: string,
  data: T | null = null,
  pagination?: PaginationT,
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  ...(pagination ? { pagination } : {}),
});

export const errorResponse = <T>(
  message: string,
  errors: unknown | null = null,
): ApiResponse<never> => ({
  success: false,
  message,
  errors,
});

export const buildProductFilter = (
  filters: productFilterT,
) => {
  const filter: Record<string, unknown> = {};

  if (filters.status) {
    filter.status = filters.status;
  }

  if (filters.category) {
    filter.categoryId = filters.category;
  }

  if (filters.search) {
    filter.$or = [
      {
        productName: {
          $regex: filters.search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: filters.search,
          $options: "i",
        },
      },
    ];
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filter.price = {
      ...(filters.minPrice !== undefined ? { $gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { $lte: filters.maxPrice } : {}),
    };
  }

  if (filters.createdFrom !== undefined || filters.createdTo !== undefined) {
    filter.createdAt = {
      ...(filters.createdFrom !== undefined
        ? { $gte: filters.createdFrom }
        : {}),
      ...(filters.createdTo !== undefined ? { $lte: filters.createdTo } : {}),
    };
  }

  return filter;
};