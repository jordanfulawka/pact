'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className='bg-background-primary h-full'>
      <div className='flex p-10 items-center justify-between'>
        <div className='text-text-primary font-headings text-2xl font-semibold'>
          {user?.name}
        </div>
        <div className='flex items-center gap-5'>
          <button className='flex bg-primary-accent rounded-md p-3 text-text-primary font-semibold'>
            <Plus /> New Pact
          </button>
          <div className='bg-primary-accent w-12 h-12 rounded-full flex items-center justify-center text-text-primary font-bold'>
            {user?.name.split(' ').map((str) => (
              <span key={str}>{str.charAt(0)}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
