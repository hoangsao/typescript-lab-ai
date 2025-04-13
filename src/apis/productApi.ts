import { Product } from '../models/product';
import { ApiResponse, PaginatedResponse } from '../models/apiResponse';
import { handlePaginatedResponse, handleResponse } from './helpers';

const serverUrl = '/api'; // Using the proxy defined in vite.config.ts

export const getProductsApi = async (
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  const response = await fetch(
    `${serverUrl}/products?_page=${page}&_limit=${limit}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );

  return handlePaginatedResponse<Product>(response, page, limit);
};

export const getProductByIdApi = async (id: number): Promise<ApiResponse<Product>> => {
  const response = await fetch(`${serverUrl}/products/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleResponse<Product>(response);
};

export const createProductApi = async (product: Omit<Product, 'id'>): Promise<ApiResponse<Product>> => {
  const response = await fetch(`${serverUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
    credentials: 'include',
  });

  return handleResponse<Product>(response);
};

export const updateProductApi = async (id: number, product: Partial<Product>): Promise<ApiResponse<Product>> => {
  const response = await fetch(`${serverUrl}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
    credentials: 'include',
  });

  return handleResponse<Product>(response);
};

export const deleteProductApi = async (id: number): Promise<ApiResponse<null>> => {
  const response = await fetch(`${serverUrl}/products/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return handleResponse<null>(response);
};