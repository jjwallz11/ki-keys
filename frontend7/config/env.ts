// frontend7/config/env.ts
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-railway-subdomain.up.railway.app"
    : "http://192.168.1.89:2911";