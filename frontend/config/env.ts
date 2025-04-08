// frontend/config/env.ts

import { Platform } from 'react-native';

const getApiBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    // @ts-ignore: 'window' might not be defined in non-browser environments, but we're checking for it
    const envBaseUrl = typeof window !== 'undefined' && (window as any)?.process?.env?.API_BASE_URL;

    if (envBaseUrl) return envBaseUrl;

    return 'http://localhost:2911'; // Web fallback
  }

  return 'http://192.168.1.89:2911'; // Native fallback
};

export const API_BASE_URL = getApiBaseUrl();
export const TOKEN_KEY = 'authToken';