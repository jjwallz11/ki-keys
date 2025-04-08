import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY } from '../config/env';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        let storedToken: string | null;

        if (Platform.OS === 'web') {
          storedToken = localStorage.getItem(TOKEN_KEY);
        } else {
          storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        }

        setToken(storedToken);
      } catch (err) {
        console.error('Error loading token:', err);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const saveToken = async (newToken: string) => {
    setToken(newToken);

    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
    }
  };

  const clearToken = async () => {
    setToken(null);

    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  };

  return { token, setToken: saveToken, clearToken, loading };
}