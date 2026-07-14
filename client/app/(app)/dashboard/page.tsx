'use client';

import CreatePactModal from '@/components/CreatePactModal';
import { useAuth } from '@/contexts/AuthProvider';
import PactCard from '@/components/PactCard';
import { usePact } from '@/contexts/PactProvider';
import { Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PendingPactCard from '@/components/PendingPactCard';
import { useSocket } from '@/contexts/SocketProvider';

function DashboardPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [showCreatePactModal, setShowCreatePactModal] = useState(false);
  const [selectedPact, setSelectedPact] = useState<string | null>(null);
  const pactsRowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { pacts, pendingPacts } = usePact();

  function updateScrollButtons() {
    const el = pactsRowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  function scrollByAmount(direction: 1 | -1) {
    const el = pactsRowRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  useEffect(() => {
    updateScrollButtons();
  }, [pacts]);

  function emitNewPact(partnerId: string, pactId: string) {
    socket?.emit('pact_created', { partnerId, pactId });
  }

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
        <div className='flex items-center gap-5'>
          <button
            className='flex bg-primary-accent rounded-md p-3 text-text-primary font-semibold'
            onClick={() => setShowCreatePactModal(true)}
          >
            <Plus /> New Pact
          </button>
          <div className='bg-primary-accent w-12 h-12 rounded-full flex items-center justify-center text-text-primary font-bold'>
            {user?.name?.split(' ').map((str) => (
              <span key={str}>{str.charAt(0)}</span>
            ))}
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
                onClick={() => scrollByAmount(-1)}
                disabled={!canScrollLeft}
              >
                <ArrowLeft />
              </button>
              <button
                className='bg-background-modal border border-primary-accent/80 rounded-full w-10 h-10 flex justify-center items-center disabled:opacity-30'
                onClick={() => scrollByAmount(1)}
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
                onClick={setSelectedPact}
                selectedPact={selectedPact}
              />
            ))}
          </div>
          <h3 className='text-2xl pb-5'>Pending Pacts</h3>
          <div className='flex flex-wrap gap-10 '>
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
