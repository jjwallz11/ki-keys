import { Platform } from 'react-native';

const getDevUrl = () => {
  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_API_BASE_URL_IOS ?? 'http://127.0.0.1:2911';
  }

  if (Platform.OS === 'android') {
    return process.env.EXPO_PUBLIC_API_BASE_URL_ANDROID ?? 'http://10.0.2.2:2911';
  }

  if (Platform.OS === 'web') {
    return process.env.EXPO_PUBLIC_API_BASE_URL_WEB ?? 'http://localhost:2911';
  }

  return process.env.EXPO_PUBLIC_API_BASE_URL_DEFAULT ?? 'http://127.0.0.1:2911';
};

export const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? getDevUrl()
    : process.env.EXPO_PUBLIC_API_BASE_URL_PROD ?? 'https://your-production-url.com';