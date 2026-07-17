import { useAuth } from '@/contexts/AuthProvider';
import { UserRoundPen, Settings, Bell, MoveRight } from 'lucide-react';

function AccountDropdown() {
  const { user, logout } = useAuth();

  return (
    <div
      className='bg-background-modal border border-text-secondary/50 w-60 rounded-[9px] flex flex-col p-3 gap-1 border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.5)]'
      onClick={(e) => e.stopPropagation()}
    >
      <div className='flex items-center gap-2 shrink px-3 py-2.5'>
        <div className='bg-primary-accent w-10 h-10 flex justify-center items-center rounded-full '>
          {user?.name?.split(' ').map((str) => (
            <span key={str}>{str.charAt(0)}</span>
          ))}
        </div>
        <div className='flex flex-col leading-tight'>
          <p className=''>{user?.name}</p>
          <p className='text-sm text-text-secondary/70'>{user?.email}</p>
        </div>
      </div>
      <hr className='border-t border-text-secondary/20' />
      <div className='flex items-center gap-2 transition-colors hover:bg-white/5 px-3 py-2.5 rounded-[9px]'>
        <UserRoundPen size={16} />
        <p className=' line-through cursor-not-allowed'>Profile</p>
      </div>
      <div className='flex items-center gap-2 transition-colors hover:bg-white/5 px-3 py-2.5 rounded-[9px]'>
        <Settings size={16} />
        <p className='line-through cursor-not-allowed'>Settings</p>
      </div>
      <div className='flex items-center gap-2 transition-colors hover:bg-white/5 px-3 py-2.5 rounded-[9px]'>
        <Bell size={16} />
        <p className='line-through cursor-not-allowed'>Notifications</p>
      </div>
      <hr className='border-t border-text-secondary/20' />
      <div className='flex items-center gap-2 px-3 py-2.5 transition-colors hover:bg-[#FF6B47]/8 rounded-[9px]'>
        <MoveRight size={16} color='#ff6b47' />
        <button className='font-semibold text-primary-accent' onClick={logout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default AccountDropdown;
