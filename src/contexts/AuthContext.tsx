import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppUser } from '../lib/auth/types';
import { authProvider } from '../lib/auth';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  refreshUser: () => void; // Trigger a manual refresh if needed
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, refreshUser: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = authProvider.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [tick]);

  const refreshUser = () => setTick(t => t + 1);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
