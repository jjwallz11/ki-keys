import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

type AuthContextType = {
  token: string | null;
  loading: boolean;
  setToken: (token: string) => Promise<void>;
  clearToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, setToken, clearToken, loading } = useAuth();

  return (
    <AuthContext.Provider value={{ token, setToken, clearToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}