// frontend/utils/api.ts
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

async function getStoredToken(): Promise<string | null> {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return localStorage.getItem("token");
  } else {
    return await SecureStore.getItemAsync("token");
  }
}

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  token?: string
) {
  const headers =
    options.headers instanceof Headers
      ? options.headers
      : new Headers(options.headers);

  // Get stored token if not provided in options
  const storedToken = await getStoredToken();
  if (storedToken) {
    headers.set("Authorization", `Bearer ${storedToken}`);
  }

  if (
    options.method &&
    options.method !== "GET" &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // This is important for cookies
    });

    if (!res.ok) {
      let errorMessage = "API request failed";
      let errorDetail = "";

      try {
        const errorResponse = await res.json();
        errorDetail = errorResponse.detail || "";
      } catch (parseError) {
        // If we can't parse the response as JSON, use the status text
        errorDetail = res.statusText;
      }

      // Create more specific error messages based on status code
      switch (res.status) {
        case 401:
          errorMessage = `Authentication failed: ${
            errorDetail || "Invalid credentials"
          }`;
          break;
        case 403:
          errorMessage = `Access denied: ${
            errorDetail || "You don't have permission to access this resource"
          }`;
          break;
        case 404:
          errorMessage = `Resource not found: ${
            errorDetail || "The requested resource does not exist"
          }`;
          break;
        case 500:
          errorMessage = `Server error: ${
            errorDetail || "An internal server error occurred"
          }`;
          break;
        default:
          errorMessage = `Request failed (${res.status}): ${
            errorDetail || "Unknown error"
          }`;
          break;
      }

      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    // Handle network and CORS errors
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error(
        "Network error: Could not connect to the API. This might be due to a CORS issue. " +
          "Please check if the backend server is running and properly configured for CORS with credentials."
      );
    }

    // Check for other potential CORS errors
    if (error instanceof DOMException && error.name === "NetworkError") {
      throw new Error(
        "CORS error: The request was blocked due to CORS policy. " +
          "Make sure the server includes the proper Access-Control-Allow-Origin header and has " +
          "Access-Control-Allow-Credentials set to true."
      );
    }

    // Re-throw other errors
    throw error;
  }
}
