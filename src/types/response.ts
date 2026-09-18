export type ApiResponse<T> =
  | {
      success: true;
      message: string;
      data: T | null;
      pagination?: PaginationT;
    }
  | {
      success: false;
      message: string;
      errors: unknown;
    };

export interface PaginationT {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
