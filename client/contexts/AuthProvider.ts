'use client';

import { createContext } from 'react';
import { User } from '../lib/types';

interface AuthContextProps {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);
