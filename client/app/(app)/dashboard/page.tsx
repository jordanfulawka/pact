'use client';

import CreatePactModal from '@/components/CreatePactModal';
import AccountDropdown from '@/components/AccountDropdown';
import { useAuth } from '@/contexts/AuthProvider';
import PactCard from '@/components/PactCard';
import { usePact } from '@/contexts/PactProvider';
import { Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PendingPactCard from '@/components/PendingPactCard';
import { useSocket } from '@/contexts/SocketProvider';
import PactCalendar from '@/components/PactCalendar';
import { Pact } from '@/lib/types';
import { getUserCheckIns as apiGetUserCheckIns } from '@/lib/api';

function DashboardPage() {
  const { token, user } = useAuth();
  const { socket } = useSocket();
  const { pacts, pendingPacts } = usePact();

  const [showCreatePactModal, setShowCreatePactModal] = useState(false);
  const [selectedPact, setSelectedPact] = useState<Pact | null>(null);
  const [selectedPactID, setSelectedPactID] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canPendingScrollLeft, setCanPendingScrollLeft] = useState(false);
  const [canPendingScrollRight, setCanPendingScrollRight] = useState(false);
  const [numCheckIns, setNumCheckIns] = useState<number | null>(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  function toggleAccountDropdown() {
    setShowAccountDropdown((prev) => !prev);
  }

  const pactsRowRef = useRef<HTMLDivElement>(null);
  const pendingPactsRowRef = useRef<HTMLDivElement>(null);

  function updateScrollButtons() {
    let el = pactsRowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    el = pendingPactsRowRef.current;
    if (!el) return;
    setCanPendingScrollLeft(el.scrollLeft > 0);
    setCanPendingScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    );
  }

  function scrollByAmount(direction: 1 | -1, el: HTMLDivElement | null) {
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  function emitNewPact(partnerId: string, pactId: string) {
    socket?.emit('pact_created', { partnerId, pactId });
  }

  function handleSelectPact(pact: Pact) {
    setSelectedPactID(pact.id);
    setSelectedPact(pact);
  }

  useEffect(() => {
    updateScrollButtons();
  }, [pacts, pendingPacts]);

  useEffect(() => {
    async function getUserCheckIns() {
      if (!token) return;
      const result = await apiGetUserCheckIns(token);
      setNumCheckIns(result.result.length);
    }
    getUserCheckIns();
  }, [token, pacts]);

  const progressPercent = ((numCheckIns ?? 0) / pacts.length) * 100;

  return (
    <div className='bg-background-primary min-h-screen'>
      {showCreatePactModal && (
        <CreatePactModal
          onClose={() => setShowCreatePactModal(false)}
          onSuccess={emitNewPact}
        />
      )}
      <div className='flex p-10 items-center justify-between'>
        <h2 className='text-text-primary font-headings text-3xl font-semibold'>
          {user?.name}
        </h2>
        <div className='h-3 bg-text-tertiary rounded-full flex-1 mx-5 flex flex-start'>
          <div
            className='h-3 bg-primary-accent rounded-full transition-[width] duration-700 ease-out'
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className='flex items-center gap-5'>
          <button
            className='flex bg-primary-accent rounded-md p-3 text-text-primary font-semibold'
            onClick={() => setShowCreatePactModal(true)}
          >
            <Plus /> New Pact
          </button>
          <div
            className='bg-primary-accent w-12 h-12 rounded-full flex items-center justify-center text-text-primary relative'
            onClick={toggleAccountDropdown}
          >
            {user?.name?.split(' ').map((str) => (
              <span key={str}>{str.charAt(0)}</span>
            ))}
            {showAccountDropdown && (
              <div className='absolute top-15 right-0 z-50'>
                <AccountDropdown />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='flex min-w-0'>
        <div className='pl-10 font-semibold text-text-primary min-w-0 w-full'>
          <div className='flex justify-between items-center pr-10 mb-5'>
            <h3 className='text-2xl '>
              Your pacts{' '}
              <span className='text-sm font-body text-text-secondary'>
                • {pacts.filter((pact) => pact.status === 'active').length}{' '}
                active
              </span>
            </h3>
            <div className='flex gap-2'>
              <button
                className='bg-background-modal border border-primary-accent/80 rounded-full w-10 h-10 flex justify-center items-center disabled:opacity-30'
                onClick={() => scrollByAmount(-1, pactsRowRef.current)}
                disabled={!canScrollLeft}
              >
                <ArrowLeft />
              </button>
              <button
                className='bg-background-modal border border-primary-accent/80 rounded-full w-10 h-10 flex justify-center items-center disabled:opacity-30'
                onClick={() => scrollByAmount(1, pactsRowRef.current)}
                disabled={!canScrollRight}
              >
                <ArrowRight />
              </button>
            </div>
          </div>
          <div
            ref={pactsRowRef}
            onScroll={updateScrollButtons}
            className='flex gap-10 pb-10 overflow-x-auto w-full min-w-0 pr-10 scrollbar-hide'
          >
            {pacts.map((pact) => (
              <PactCard
                key={pact.id}
                pact={pact}
                onClick={handleSelectPact}
                selectedPactID={selectedPactID}
              />
            ))}
          </div>
          {selectedPact && <PactCalendar pact={selectedPact} />}
          {pendingPacts.length > 0 && (
            <div className='flex justify-between items-center pr-10 mb-5'>
              <h3 className='text-2xl'>Pending Pacts</h3>
              <div className='flex gap-2'>
                <button
                  className='bg-background-modal border border-primary-accent/80 rounded-full w-10 h-10 flex justify-center items-center disabled:opacity-30'
                  onClick={() => scrollByAmount(-1, pendingPactsRowRef.current)}
                  disabled={!canPendingScrollLeft}
                >
                  <ArrowLeft />
                </button>
                <button
                  className='bg-background-modal border border-primary-accent/80 rounded-full w-10 h-10 flex justify-center items-center disabled:opacity-30'
                  onClick={() => scrollByAmount(1, pendingPactsRowRef.current)}
                  disabled={!canPendingScrollRight}
                >
                  <ArrowRight />
                </button>
              </div>
            </div>
          )}
          <div
            className='flex gap-10 overflow-x-auto scrollbar-hide pr-10'
            ref={pendingPactsRowRef}
            onScroll={updateScrollButtons}
          >
            {pendingPacts.map((pendingPact) => (
              <PendingPactCard key={pendingPact.id} pact={pendingPact} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
