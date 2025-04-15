// utils/api.ts
import { getToken } from "./auth";
import { API_BASE_URL } from "@/config/env";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.detail || res.statusText;
    throw new Error(message);
  }

  return res.json();
}