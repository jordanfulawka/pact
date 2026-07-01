'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { getCheckIn } from '@/lib/api';
import { Pact } from '@/lib/types';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

function PactCard({ pact }: { pact: Pact }) {
  const [checkedIn, setCheckedIn] = useState(false);
  const [partnerCheckedIn, setPartnerCheckedIn] = useState(false);

  const { token, user } = useAuth();

  async function getCheckIns() {
    if (!token || !user?.id) return null;

    const { result: myCheckIn } = await getCheckIn(token, pact.id, user.id);
    setCheckedIn(!!myCheckIn);

    const { result: partnerCheckIn } = await getCheckIn(
      token,
      pact.id,
      pact.other_user_id,
    );
    setPartnerCheckedIn(!!partnerCheckIn);
  }

  useEffect(() => {
    getCheckIns();
  }, []);

  function daysUntilDate(date: string) {
    const start = new Date();
    const end = new Date(date);
    const timeDifference: any = end - start;
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.floor(daysDifference);
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
          <div className='flex gap-5 my-2 text-sm text-text-secondary bg-text-tertiary/40 p-1 rounded-md w-fit font-light'>
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
          <div className='bg-text-tertiary/40 rounded-md p-3'>
            <p className='text-text-secondary/50 text-sm tracking-widest uppercase font-light mb-3'>
              Today&apos;s check ins
            </p>
            <div className='flex justify-between'>
              <div className='flex gap-2'>
                {checkedIn ? (
                  <div className='h-10 w-10 rounded-full bg-primary-accent flex items-center justify-center'>
                    <Check />
                  </div>
                ) : (
                  <div className='h-10 w-10 rounded-full bg-background-card/40 border border-text-secondary/20' />
                )}
                <div className='text-sm font-light tracking-widest text-text-secondary'>
                  <p>You</p>
                  <p>{checkedIn ? 'Done!' : 'Pending'}</p>
                </div>
              </div>
              <div className='flex gap-2'>
                {partnerCheckedIn ? (
                  <div className='h-10 w-10 rounded-full bg-secondary-accent flex items-center justify-center'>
                    <Check />
                  </div>
                ) : (
                  <div className='h-10 w-10 rounded-full bg-background-card/40 border border-text-secondary/20' />
                )}
                <div className='text-sm font-light tracking-widest text-text-secondary'>
                  <p>{pact.partner_name}</p>
                  <p>{partnerCheckedIn ? 'Done!' : 'Pending'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PactCard;
