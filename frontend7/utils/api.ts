// frontend6/utils/api.ts
import { getToken } from "./auth";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://192.168.1.89:2911"
    : "https://your-production-url.com"; // replace later

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
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