import type { Model } from "mongoose";
import type { PaginationT } from "../types/response.js";

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginationOptionT = {
  page: number;
  limit: number;
  select?: string;
  sort?: string;
};

interface PaginatedResultT<T> {
  data: T[];
  pagination: PaginationT;
}

export const getPagination = ({ page = 1, limit = 10 }: PaginationParams) => {
  const currentPage = Math.max(page, 1);
  const currentLimit = Math.min(Math.max(limit, 1), 100);

  return {
    page: currentPage,
    limit: currentLimit,
  };
};

export const paginate = async <T>(
  model: Model<T>,
  filter: object,
  options: PaginationOptionT,
): Promise<PaginatedResultT<T>> => {
  const { page, limit, select, sort } = options;
  const skip = (page - 1) * limit;

  const query = model.find(filter).skip(skip).limit(limit);

  if (select) {
    query.select(select);
  }
  if (sort) {
    query.sort(sort);
  }

  const [data, total] = await Promise.all([
    query,
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
