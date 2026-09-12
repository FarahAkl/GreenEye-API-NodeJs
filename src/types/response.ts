export type ApiResponse<T> =
  | {
      success: true;
      message: string;
      data: T | null;
    }
  | {
      success: false;
      message: string;
      errors: unknown;
    };
