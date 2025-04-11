import { AuthToken } from '../models/authToken';
import { ApiResponse } from '../models/apiResponse';

const serverUrl = '/api'; // Updated to use proxy instead of direct server URL

const handleResponse = async <T> (response: Response): Promise<ApiResponse<T>> => {
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

export const login = async (username: string, password: string): Promise<ApiResponse<AuthToken>> => {
  const response = await fetch(`${serverUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return handleResponse<AuthToken>(response);
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${serverUrl}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

export const checkAuth = async (): Promise<ApiResponse<null>> => {
  const response = await fetch(`${serverUrl}/auth/check`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Not authenticated');
  }

  return handleResponse<null>(response);
};