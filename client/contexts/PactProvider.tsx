'use client';

import {
  acceptPact as apiAcceptPact,
  getPacts,
  rejectPact as apiRejectPact,
} from '@/lib/api';
import { Pact } from '@/lib/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useSocket } from './SocketProvider';

interface PactContextProps {
  pacts: Pact[];
  pendingPacts: Pact[];
  addPact: () => void;
  acceptPact: (pactId: string) => void;
  rejectPact: (pactId: string) => void;
  fetchPacts: () => void;
}

const PactContext = createContext<PactContextProps | null>(null);

function PactProvider({ children }: { children: React.ReactNode }) {
  const [pacts, setPacts] = useState<Pact[]>([]);
  const [pendingPacts, setPendingPacts] = useState<Pact[]>([]);
  const { token, user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on('refresh_pacts', () => {
      console.log('new pact created!');
      fetchPacts();
    });
    return () => {
      socket.off('refresh_pacts');
    };
  }, [socket]);

  function addPact() {
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
      const result = await getPacts(token);
      setPacts(result.pacts);
      setPendingPacts(result.pendingPacts);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPacts();
  }, [token]);

  return (
    <PactContext.Provider
      value={{
        pacts,
        pendingPacts,
        addPact,
        acceptPact,
        rejectPact,
        fetchPacts,
      }}
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
