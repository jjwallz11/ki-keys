// frontend/hooks/useAuthRedirect.ts
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuthContext } from '../providers/AuthProvider';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export function useAuthRedirect() {
  const { token, loading } = useAuthContext();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (!loading && !token) {
      navigation.replace('Login');
    }
  }, [loading, token]);
}