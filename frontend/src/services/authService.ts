const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Login failed');
    }

    return data; // { token, role, user_id }
};

export const registerUser = async (email: string, password: string, role: string, name: string) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role, name }),
  });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
    }

    return data; // { message, user }
};
export const getToken = (): string | null => {
  return sessionStorage.getItem('maverick_token');
};

export const setToken = (token: string): void => {
  sessionStorage.setItem('maverick_token', token);
};

export const clearToken = (): void => {
  sessionStorage.removeItem('maverick_token');
};