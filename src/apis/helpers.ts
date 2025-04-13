import { ApiResponse, PaginatedResponse } from '../models/apiResponse';

export const handleResponse = async <T> (response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    return {
      success: false,
      message: response.statusText || 'Request failed',
      data: null,
      error: {
        code: response.status.toString(),
        details: await response.text(),
      },
    };
  }

  const data = await response.json();
  return {
    success: true,
    message: 'Request successful',
    data,
    error: null,
  };
};

export const handlePaginatedResponse = async <T> (response: Response, pageNumber: number, pageSize: number): Promise<ApiResponse<PaginatedResponse<T>>> => {
  if (!response.ok) {
    return {
      success: false,
      message: response.statusText || 'Request failed',
      data: null,
      error: {
        code: response.status.toString(),
        details: await response.text(),
      },
    };
  }

  const data = await response.json();
  return {
    success: true,
    message: 'Request successful',
    data: {
      items: data || [],
      pagination: {
        currentPage: pageNumber || 1,
        pageSize: pageSize || 10,
        totalItems: parseInt(response.headers.get('X-Total-Count') || '0', 10),
      },
    },
    error: null,
  };
};