'use client';

import { usePact } from '@/contexts/PactProvider';
import { useSocket } from '@/contexts/SocketProvider';
import { Pact } from '@/lib/types';
import { Check, X, Clock } from 'lucide-react';
import { useEffect } from 'react';

function parseDateOnly(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function PendingPactCard({ pact }: { pact: Pact }) {
  const { acceptPact, rejectPact } = usePact();
  const { fetchPacts } = usePact();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('pact_delete', fetchPacts);

    return () => {
      socket.off('pact_delete', fetchPacts);
    };
  });

  return (
    <div className='w-75 border border-primary-accent/20 rounded-xl bg-background-modal p-5'>
      <div className='flex items-center gap-3'>
        <div className='bg-primary-accent w-10 h-10 rounded-full flex items-center justify-center text-text-primary font-bold'>
          {pact?.partner_username?.split(' ').map((str: string) => (
            <span key={str}>{str.charAt(0)}</span>
          ))}
        </div>
        <div className='flex flex-col'>
          <p className='text-text-tertiary text-xs tracking-widest'>
            pact invite from
          </p>
          <p className='text-text-secondary'>{pact.partner_name}</p>
        </div>
      </div>
      <div className='pt-5 font-headings text-2xl'>{pact.title}</div>
      <div className='flex items-center gap-1'>
        <Clock size={16} color='#9a918c' />
        <p className='text-text-secondary/80 tracking-wide font-light text-sm'>
          {/* Ends{' '}
        {parseDateOnly(pact.end_date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          })} */}
          {pact.duration_value}{' '}
          {pact.duration_value > 1
            ? pact.duration_unit
            : pact.duration_unit.slice(0, -1)}
        </p>
      </div>
      <div className='flex gap-3 pt-3'>
        <button
          className='border border-text-secondary/20 rounded-full h-12 w-12 flex justify-center items-center'
          onClick={() => rejectPact(pact.id)}
        >
          <X />
        </button>
        <button
          className='bg-primary-accent rounded-full flex-1 flex justify-center items-center text-black font-bold'
          onClick={() => acceptPact(pact.id)}
        >
          Accept <Check />
        </button>
      </div>
    </div>
  );
}

export default PendingPactCard;
