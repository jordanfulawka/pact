import { useAuth } from '@/contexts/AuthProvider';
import { X } from 'lucide-react';
import { useEffect } from 'react';

function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs'
      onClick={onClose}
    >
      <div
        className='w-115 border border-primary-accent/30 rounded-4xl bg-background-modal animate-modalIn p-10'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center'>
          <h2 className='text-text-primary text-2xl font-semibold'>
            Your Profile
          </h2>
          <button
            className='w-10 h-10 bg-text-tertiary/80  flex justify-center items-center rounded-md border border-text-secondary/20'
            type='button'
            onClick={onClose}
          >
            <X color='#9a918c' size={16} />
          </button>
        </div>
        <div className='flex justify-center py-5'>
          <div className='bg-primary-accent w-25 h-25 text-3xl font-bold rounded-full flex items-center justify-center text-text-primary'>
            {user?.name?.split(' ').map((str) => (
              <span key={str}>{str.charAt(0)}</span>
            ))}
          </div>
        </div>
        <div className='flex justify-center gap-3 mt-3'>
          <button className='text-text-primary px-4 py-2.5 text-sm bg-text-tertiary/80 rounded-2xl border border-text-secondary/20'>
            Upload Photo
          </button>
          <button className='text-text-primary/20 px-4 py-2.5 text-sm bg-text-tertiary/20 rounded-2xl border border-text-tertiary'>
            Remove
          </button>
        </div>
        <p className='text-text-tertiary font-headings text-center pt-2'>
          JPG or PNG. Square works best
        </p>
        <hr className='border-t border-text-secondary/20 my-8' />
        <div className='flex flex-col justify-center gap-5'>
          <div className='flex flex-col gap-2'>
            <label className='font-body text-text-tertiary'>Name</label>
            <input
              type='text'
              value={user?.name}
              readOnly
              className='p-4 bg-text-tertiary/10 rounded-2xl text-text-primary font-semibold border border-text-label/40  cursor-not-allowed'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-body text-text-tertiary'>Email</label>
            <input
              type='text'
              value={user?.name}
              readOnly
              className='p-4 bg-text-tertiary/10 rounded-2xl text-text-primary font-semibold border border-text-label/40  cursor-not-allowed'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
