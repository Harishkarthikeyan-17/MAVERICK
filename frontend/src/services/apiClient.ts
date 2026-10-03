import { getToken } from './authService';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

export const apiClient = async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { data, headers, ...customConfig } = options;
  const token = getToken() || localStorage.getItem('token');

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || result.message || 'API Error');
  }

  return result;
};
