'use client';

import { Pact } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

interface PactContextProps {
  pacts: Pact[];
  addPact: (pact: Pact) => void;
}

const PactContext = createContext<PactContextProps | null>(null);

function PactProvider({ children }: { children: React.ReactNode }) {
  const [pacts, setPacts] = useState<Pact[]>([]);

  function addPact(pact: Pact) {
    setPacts((prev) => [...prev, pact]);
  }

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
