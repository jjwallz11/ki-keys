import { API_BASE_URL } from '../../config/env';
import { saveToken, getToken, clearToken } from '../../utils/tokenStorage';

export async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/session/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  const data = await response.json();
  const token = data.access_token;

  await saveToken(token);

  return token;
}

export async function getStoredToken(): Promise<string | null> {
  return await getToken();
}

export async function removeToken(): Promise<void> {
  await clearToken();
}

export async function requestPasswordReset(email: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/session/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'Unable to send reset link');
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/session/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password: newPassword }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'Reset password failed');
  }
}