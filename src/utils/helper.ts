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
