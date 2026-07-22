'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../lib/types';
import { fetchMe } from '@/lib/api';

interface AuthContextProps {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      name: payload.name,
      username: payload.username,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(stored);
      setUser(decodeToken(stored));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token || !user) return;
    fetchMe(token).then((data) => {
      setUser((prev) =>
        prev ? { ...prev, avatar_url: data.avatar_url ?? null } : prev,
      );
    });
  }, [token]);

  function login(token: string) {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(decodeToken(token));
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth can only be used within the AuthProvider');
  return context;
}

export { AuthProvider, useAuth };
