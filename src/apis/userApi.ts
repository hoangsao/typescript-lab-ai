import { User } from '../models/user';
import { ApiResponse, PaginatedResponse } from '../models/apiResponse';
import { handlePaginatedResponse, handleResponse } from './helpers';

const serverUrl = '/api'; // Updated to use proxy instead of direct server URL

export const getUsersApi = async (
  currentPage: number,
  pageSize: number
): Promise<ApiResponse<PaginatedResponse<User>>> => {
  const response = await fetch(
    `${serverUrl}/users?_page=${currentPage}&_limit=${pageSize}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  return handlePaginatedResponse<User>(response, currentPage, pageSize);
};

export const getUserByIdApi = async (id: number): Promise<ApiResponse<User>> => {
  const response = await fetch(`${serverUrl}/users/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  return handleResponse<User>(response);
};

export const createUserApi = async (user: User): Promise<ApiResponse<User>> => {
  const response = await fetch(`${serverUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  return handleResponse<User>(response);
};

export const updateUserApi = async (id: number, user: User): Promise<ApiResponse<User>> => {
  const response = await fetch(`${serverUrl}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  return handleResponse<User>(response);
};

export const deleteUserApi = async (id: number): Promise<ApiResponse<null>> => {
  const response = await fetch(`${serverUrl}/users/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  return handleResponse<null>(response);
};

export const getAuthUserApi = async (): Promise<ApiResponse<User>> => {
  const response = await fetch(`${serverUrl}/auth/me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Not authenticated');
  }
  return handleResponse<User>(response);
};

export const updateProfileApi = async (id: number, profileData: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await fetch(`${serverUrl}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
    credentials: 'include',
  });

  return handleResponse<User>(response);
};