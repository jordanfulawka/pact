'use client';

import {
  acceptPact as apiAcceptPact,
  getPacts,
  rejectPact as apiRejectPact,
} from '@/lib/api';
import { Pact } from '@/lib/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

interface PactContextProps {
  pacts: Pact[];
  pendingPacts: Pact[];
  addPact: (pact: Pact) => void;
  acceptPact: (pactId: string) => void;
  rejectPact: (pactId: string) => void;
}

const PactContext = createContext<PactContextProps | null>(null);

function PactProvider({ children }: { children: React.ReactNode }) {
  const [pacts, setPacts] = useState<Pact[]>([]);
  const [pendingPacts, setPendingPacts] = useState<Pact[]>(null);

  const { token } = useAuth();

  function addPact(pact: any) {
    setPacts((prev) => [...prev, pact.newPact]);
    fetchPacts();
  }

  async function acceptPact(pactId: string) {
    if (!token) return null;
    try {
      await apiAcceptPact(token, pactId);
    } catch (err) {
      console.log(err);
    }
  }

  async function rejectPact(pactId: string) {
    if (!token) return null;
    try {
      await apiRejectPact(token, pactId);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchPacts() {
    if (!token) return null;
    try {
      console.log(token);
      const result = await getPacts(token);
      setPacts(result.pacts);
      setPendingPacts(result.pendingPacts);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPacts();
  }, [token]);

  return (
    <PactContext.Provider
      value={{ pacts, pendingPacts, addPact, acceptPact, rejectPact }}
    >
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
