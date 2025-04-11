export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: {
    code: string;
    details: string;
  } | null;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}