'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';

interface SocketContextTypes {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextTypes | null>(null);

function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      auth: { token },
    });

    newSocket.on('connect', () => console.log('socket connected'));
    setSocket(newSocket);

    return () => {
      socket?.disconnect();
      setSocket(null);
    };
  }, [user?.id, token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

function useSocket() {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error('useSocket can only be used within SocketProvider');
  return context;
}

export { SocketProvider, useSocket };
