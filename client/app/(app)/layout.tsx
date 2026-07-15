'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      redirect('/login');
    }
  }, [token, loading]);

  if (loading || !token) return null;

  return <>{children}</>;
}
