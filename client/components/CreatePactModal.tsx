'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { usePact } from '@/contexts/PactProvider';
import { handleCreatePact } from '@/lib/api';
import { Handshake, X } from 'lucide-react';
import { useState } from 'react';

function CreatePactModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (partnerId: string) => void;
}) {
  const [commitment, setCommitment] = useState('');
  const [invite, setInvite] = useState('');
  const [endDate, setEndDate] = useState('');

  const { token } = useAuth();
  const { addPact } = usePact();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return null;
    try {
      const { newPact } = await handleCreatePact(
        token,
        commitment,
        invite,
        endDate,
      );
      console.log(newPact);
      addPact();
      onClose();
      onSuccess(newPact.partner_id);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 backdrop-blur-xs flex justify-center items-center'
      onClick={onClose}
    >
      <div
        className='w-130 bg-background-modal border border-primary-accent/30 rounded-4xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between px-10 py-10'>
          <div className='flex flex-col'>
            <h3 className='font-semibold font-headings text-2xl flex items-center gap-2 text-text-primary'>
              New Pact <Handshake color='yellow' />
            </h3>
            <p className='font-body text-text-tertiary'>
              Make a commitment. Keep it together.
            </p>
          </div>
          <div
            className='w-10 h-10 flex items-center justify-center bg-text-tertiary rounded-md m-2'
            onClick={onClose}
          >
            <X color='white' />
          </div>
        </div>
        <div>
          <form
            className='flex flex-col gap-5 items-center mb-10'
            onSubmit={handleSubmit}
          >
            <div className='flex flex-col'>
              <label className='font-body text-text-tertiary'>Commitment</label>
              <input
                type='text'
                placeholder='e.g. Read for 30 minutes every day'
                value={commitment}
                onChange={(e) => setCommitment(e.target.value)}
                className='p-4 bg-text-tertiary/40 w-100 rounded-2xl text-text-primary font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
              />
            </div>
            <div className='flex flex-col'>
              <label className='font-body text-text-tertiary'>End Date</label>
              <input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='p-4 bg-text-tertiary/40 w-100 rounded-2xl text-text-primary font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
              />
            </div>
            <div className='flex flex-col'>
              <label className='font-body text-text-tertiary'>
                Invite Partner
              </label>
              <input
                type='text'
                placeholder='Their username'
                value={invite}
                onChange={(e) => setInvite(e.target.value)}
                className='p-4 bg-text-tertiary/40 w-100 rounded-2xl text-text-primary font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
              />
            </div>
            <button className='bg-primary-accent w-100 p-3 text-text-primary font-semibold rounded-2xl'>
              Send Pact Invite
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePactModal;
