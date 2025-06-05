import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getToken } from '../hooks/useAuthToken';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    };

    checkAuth();
  }, []);

  return null;
}