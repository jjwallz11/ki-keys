// frontend/config/env.ts
import { Platform } from "react-native";

const DEV_IP = "192.168.1.89"; // LAN IP for local dev
const DEV_PORT = "2911";

const LOCAL_BACKEND = `http://${DEV_IP}:${DEV_PORT}`;
const PROD_BACKEND = "https://your-production-domain.com"; // Replace later when you deploy

export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? PROD_BACKEND
    : Platform.OS === "web"
    ? "/api" // Use relative path on web with proxy (if set up)
    : LOCAL_BACKEND;