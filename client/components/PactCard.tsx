'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { usePact } from '@/contexts/PactProvider';
import { useSocket } from '@/contexts/SocketProvider';
import { checkIn, getCheckIn, cancelPact } from '@/lib/api';
import { Pact } from '@/lib/types';
import { Check, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

function PactCard({
  pact,
  onClick,
  selectedPactID,
}: {
  pact: Pact;
  onClick: (pact: Pact) => void;
  selectedPactID: string | null;
}) {
  const [checkedIn, setCheckedIn] = useState(false);
  const [partnerCheckedIn, setPartnerCheckedIn] = useState(false);

  const { token, user } = useAuth();
  const { socket } = useSocket();
  const { fetchPacts } = usePact();

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

  async function handleCheckIn() {
    try {
      if (!token) return null;
      if (!socket) return null;
      await checkIn(token, pact.id);
      setCheckedIn(true);
      getCheckIns();
      socket.emit('pact_checkin', pact.id);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!socket) return;

    function handlePactCheckin() {
      getCheckIns();
      fetchPacts();
    }

    function handleStreakReset() {
      console.log('streak reset!');
      fetchPacts();
    }

    socket.on('pact_checkin', handlePactCheckin);
    socket.on('pact_delete', fetchPacts);
    socket.on('streak_reset', handleStreakReset);

    return () => {
      socket.off('pact_checkin', handlePactCheckin);
      socket.off('pact_delete', fetchPacts);
      socket.off('streak_reset', handleStreakReset);
    };
  }, [socket]);

  useEffect(() => {
    getCheckIns();
  }, []);

  function parseDateOnly(date: string) {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function daysUntilDate(date: string) {
    const today = new Date();
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const end = parseDateOnly(date);
    const timeDifference = end.getTime() - start.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.floor(daysDifference);
  }

  function handleClick() {
    if (pact.status === 'pending') return;
    onClick(pact);
  }

  return (
    <div
      className={`w-75 border ${selectedPactID === pact.id ? 'border-primary-accent/80' : pact.status === 'pending' ? 'border-text-secondary/30 border-dashed' : 'border-primary-accent/20'} rounded-xl bg-background-modal p-5 shrink-0`}
      onClick={handleClick}
    >
      <div className='flex items-center gap-3'>
        <div
          className={`${pact.status === 'pending' ? 'bg-text-tertiary' : 'bg-primary-accent'} w-10 h-10 rounded-full flex items-center justify-center text-text-primary font-bold`}
        >
          {pact?.partner_username?.split(' ').map((str: string) => (
            <span key={str}>{str.charAt(0)}</span>
          ))}
        </div>
        <div className='flex flex-col'>
          <p className='text-text-tertiary text-xs tracking-widest'>
            {`${pact.status === 'pending' ? 'pact sent to' : 'pact with'}`}
          </p>
          <p className='text-text-secondary'>{pact.partner_name}</p>
        </div>
      </div>
      <div
        className={`py-5 font-headings text-2xl ${pact.status === 'pending' ? 'text-text-secondary' : ''}`}
      >
        {pact.title}
      </div>
      {pact.status === 'pending' ? (
        <div>
          <div className='bg-text-secondary/8 p-3 flex items-center gap-2 rounded-md'>
            <Clock color='#9a918c' />
            <p className='text-sm font-light text-text-secondary'>
              Waiting for {pact?.partner_username} to accept
            </p>
          </div>
          <button
            className='text-sm text-text-secondary/50 underline font-light text-center pt-3 w-full'
            onClick={() => {
              if (!token) return;
              if (!socket) return;
              cancelPact(token, pact.id);
              socket.emit('pact_delete', pact.id);
            }}
          >
            Cancel Invite
          </button>
        </div>
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
                {parseDateOnly(pact.end_date).toLocaleDateString('en-US', {
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
          {checkedIn ? (
            <button
              className='bg-text-label w-full p-2 mt-5 rounded-md cursor-not-allowed font-light'
              onClick={handleCheckIn}
              disabled={checkedIn}
            >
              Already checked in today
            </button>
          ) : (
            <button
              className='bg-primary-accent w-full p-2 mt-5 rounded-md'
              onClick={handleCheckIn}
            >
              Check In
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PactCard;
