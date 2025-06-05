import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, setToken, removeToken } from '../hooks/useAuthToken';
import { usePathname } from 'expo-router';
import { API_BASE_URL } from '../config/env';

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const refresh = async () => {
    const token = await getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/session/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Invalid token');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      await removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    await setToken(token);
    await refresh();
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  useEffect(() => {
    refresh();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};