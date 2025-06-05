import { Platform } from 'react-native';

export const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? Platform.select({
        web: 'http://localhost:2911',
        ios: 'http://127.0.0.1:2911',
        android: 'http://10.0.2.2:2911',
        default: 'http://127.0.0.1:2911',
      })!
    : 'https://your-production-url.com';