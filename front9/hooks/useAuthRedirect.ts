import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { getToken } from './useAuthToken';

export function useAuthRedirect() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      const inAuthGroup = segments[0] === '(auth)' || segments[0] === 'login';

      if (!token && !inAuthGroup) {
        router.replace('/login');
      } else if (token && inAuthGroup) {
        router.replace('/home');
      }
    };

    checkAuth();
  }, [segments]);
}