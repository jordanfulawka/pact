'use client';

import CreatePactModal from '@/components/CreatePactModal';
import { useAuth } from '@/contexts/AuthProvider';
import PactCard from '@/components/PactCard';
import { usePact } from '@/contexts/PactProvider';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import PendingPactCard from '@/components/PendingPactCard';
import { useSocket } from '@/contexts/SocketProvider';

function DashboardPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [showCreatePactModal, setShowCreatePactModal] = useState(false);

  const { pacts, pendingPacts } = usePact();

  useEffect(() => {
    console.log(pacts);
    console.log(pendingPacts);
  }, [pacts, pendingPacts]);

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
      <div className='px-10 font-semibold text-text-primary'>
        <h3 className='text-2xl pb-10'>
          Your pacts{' '}
          <span className='text-sm font-body text-text-secondary'>
            • {pacts.filter((pact) => pact.status === 'active').length} active
          </span>
        </h3>
        <div className='flex flex-wrap gap-10 max-w-[90%]'>
          {pacts.map((pact) => (
            <PactCard key={pact.id} pact={pact} />
          ))}
        </div>
      </div>
      {pendingPacts?.length > 0 && (
        <div className='px-10 pt-20 font-semibold text-text-primary pb-5'>
          <h3 className='text-2xl pb-10'>Pending Pacts</h3>
          <div className='flex flex-wrap gap-10'>
            {pendingPacts.map((pendingPact) => (
              <PendingPactCard key={pendingPact.id} pact={pendingPact} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
