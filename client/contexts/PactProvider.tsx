'use client';

import { getPacts } from '@/lib/api';
import { Pact } from '@/lib/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

interface PactContextProps {
  pacts: Pact[];
  addPact: (pact: Pact) => void;
}

const PactContext = createContext<PactContextProps | null>(null);

function PactProvider({ children }: { children: React.ReactNode }) {
  const [pacts, setPacts] = useState<Pact[]>([]);

  const { token } = useAuth();

  function addPact(pact: Pact) {
    setPacts((prev) => [...prev, pact.newPact]);
    fetchPacts();
  }

  async function fetchPacts() {
    if (!token) return null;
    try {
      console.log(token);
      const result = await getPacts(token);
      setPacts(result.pacts);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPacts();
  }, [token]);

  return (
    <PactContext.Provider value={{ pacts, addPact }}>
      {children}
    </PactContext.Provider>
  );
}

function usePact() {
  const context = useContext(PactContext);
  if (!context) throw new Error('usePact can only be used within PactProvider');
  return context;
}

export { PactProvider, usePact };
