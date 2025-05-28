// config/env.ts

import Constants from 'expo-constants';
import { Platform } from 'react-native';

const localhost =
  Platform.OS === 'android' ? 'http://10.0.2.2:2911' : 'http://localhost:2911';

// Use a dynamic override if set via env
const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL || localhost;

export { API_BASE_URL };

// Optional: Add other dynamic config exports here later