'use client';

import { Pact } from '@/lib/types';

function PactCard({ pact }: { pact: Pact }) {
  function daysUntilDate(date: string) {
    const start = new Date();
    const end = new Date(date);
    const timeDifference: any = end - start;
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.ceil(daysDifference);
  }

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
      {pact.status === 'pending' ? (
        <div>Await confirmation from partner</div>
      ) : (
        <div>
          <div>
            <span className='text-yellow-300 text-6xl'>
              {pact.current_streak}
            </span>
            <span className='text-text-tertiary'>day streak</span>
          </div>
          <div className='flex gap-5 text-sm text-text-secondary bg-text-tertiary p-1 rounded-md w-fit'>
            <div>
              <p>
                Ends{' '}
                {new Date(pact.end_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p>
                <span>{daysUntilDate(pact.end_date)}</span> days left
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PactCard;
