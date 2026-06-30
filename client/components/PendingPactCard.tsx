'use client';

import { usePact } from '@/contexts/PactProvider';
import { acceptPact } from '@/lib/api';
import { Check, X } from 'lucide-react';

function PendingPactCard({ pact }: { pact: any }) {
  const { acceptPact, rejectPact } = usePact();

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
            pact with
          </p>
          <p className='text-text-secondary'>{pact.partner_name}</p>
        </div>
      </div>
      <div className='py-5 font-headings text-2xl'>{pact.title}</div>
      <div className='flex justify-around'>
        <div
          className='w-10 h-10 rounded-full bg-green-500 flex justify-center items-center'
          onClick={() => acceptPact(pact.id)}
        >
          <Check />
        </div>
        <div
          className='w-10 h-10 rounded-full bg-red-500 flex justify-center items-center'
          onClick={() => rejectPact(pact.id)}
        >
          <X />
        </div>
      </div>
    </div>
  );
}

export default PendingPactCard;
