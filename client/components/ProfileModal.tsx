import { useAuth } from '@/contexts/AuthProvider';
import { getAvatarUploadUrl, updateAvatarUrl } from '@/lib/api';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

function ProfileModal({ onClose }: { onClose: () => void }) {
  const { token, user, refreshUser } = useAuth();

  useEffect(() => {
    console.log(user);
  }, [user]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];

    // get secure URL from our server
    if (!token) return;
    const { result } = await getAvatarUploadUrl(token, file.type);
    console.log(result.key);
    console.log(result.url);
    const url = result.url;

    // post image directly to the s3 bucket
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    // post request to my server to store URL to users page
    const imgURL = result.url.split('?')[0];
    await updateAvatarUrl(token, imgURL);
    await refreshUser();
  }

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
          {user?.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.name ?? 'avatar'}
              width={100}
              height={100}
              className='w-25 h-25 rounded-full'
            />
          ) : (
            <div className='bg-primary-accent w-25 h-25 text-3xl font-bold rounded-full flex items-center justify-center text-text-primary'>
              {user?.name?.split(' ').map((str) => (
                <span key={str}>{str.charAt(0)}</span>
              ))}
            </div>
          )}
        </div>
        <div className='flex justify-center gap-3 mt-3'>
          <label
            className='text-text-primary px-4 py-2.5 text-sm bg-text-tertiary/80 rounded-2xl border border-text-secondary/20'
            htmlFor='profile-image-upload'
          >
            <span>Upload Photo</span>
            <input
              id='profile-image-upload'
              type='file'
              className='hidden'
              accept='image/*'
              onChange={handleImageUpload}
            />
          </label>
          <button
            className='text-text-primary/20 px-4 py-2.5 text-sm bg-text-tertiary/20 rounded-2xl border border-text-tertiary'
            type='button'
          >
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
