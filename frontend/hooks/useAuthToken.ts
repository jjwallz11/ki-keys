import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export async function useAuthToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null; // Return null during server-side rendering
  } else {
    return await SecureStore.getItemAsync("token");
  }
}
