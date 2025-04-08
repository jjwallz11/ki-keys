import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY } from '../config/env';

/**
 * Get the token from storage, either from AsyncStorage (mobile) or localStorage (web).
 */
export async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  } else {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }
}

/**
 * Save the token to storage, either in AsyncStorage (mobile) or localStorage (web).
 * @param token - The token to save.
 */
export async function saveToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Clear the token from storage, either from AsyncStorage (mobile) or localStorage (web).
 */
export async function clearToken(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}
