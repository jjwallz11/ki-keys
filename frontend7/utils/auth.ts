import { Platform } from "react-native";

import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "access_token";

export const getToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const setToken = async (token: string): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

export const removeToken = async (): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};