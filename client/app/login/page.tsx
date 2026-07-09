'use client';

import { useState } from 'react';
import { Handshake } from 'lucide-react';
import { login as apiLogin, register as apiRegister } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';

function LoginPage() {
  const [mode, setMode] = useState<'signup' | 'login'>('login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { login, logout, user } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const { token } = await apiLogin(email, password);
      console.log(token);
      login(token);
      setLoading(false);
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const { token } = await apiRegister(name, username, email, password);
      login(token);
      console.log(token);
      setLoading(false);
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className='bg-background-primary min-h-screen'>
      <div className='flex h-full justify-between'>
        <div className='flex-1 flex flex-col max-w-150'>
          <div className='flex items-center gap-4 pl-20 p-5'>
            <div className='p-2 w-fit bg-primary-accent rounded-lg '>
              <Handshake color={'yellow'} size={40} />
            </div>
            <h3 className='text-text-primary font-headings text-2xl font-semibold'>
              Pact
            </h3>
          </div>
          <div className='flex-1 flex flex-col justify-center gap-8 pb-20'>
            <p className='text-text-label uppercase text-sm tracking-widest pl-20'>
              Paired Accountability
            </p>
            <h1 className='font-headings text-text-primary text-5xl font-semibold pl-20'>
              Commitments keep better{' '}
              <span className='text-primary-accent'>together.</span>
            </h1>
            <p className='text-text-label pl-20'>
              Make a daily pact with someone you trust. Check in. Protect your
              streak. Hold each other to it.
            </p>
          </div>
        </div>

        <div className='w-lg flex flex-col '>
          <div className='flex-1 flex items-end pb-10'>
            <div className='bg-background-selected w-100 flex rounded-md'>
              <button
                onClick={() => setMode('login')}
                className={`${mode === 'login' ? 'bg-primary-accent' : ''} flex-1 rounded-md p-2`}
              >
                Sign in
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`${mode === 'signup' ? 'bg-primary-accent' : ''} flex-1 rounded-md p-2`}
              >
                Create account
              </button>
            </div>
          </div>
          <div className=' flex-3 flex flex-col pb-30'>
            <h2 className='text-text-primary font-headings text-2xl font-semibold mb-10'>
              {mode === 'signup'
                ? 'Start your first pact today'
                : 'Welcome back!'}
            </h2>
            {mode === 'signup' ? (
              <form
                className='flex flex-col justify-center gap-4'
                onSubmit={handleRegister}
              >
                <input
                  type='text'
                  placeholder='Your name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='p-4 bg-background-card w-100 rounded-2xl text-text-label font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
                />
                <input
                  type='text'
                  placeholder='Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='p-4 bg-background-card w-100 rounded-2xl text-text-label font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
                />
                <input
                  type='text'
                  placeholder='Email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='p-4 bg-background-card w-100 rounded-2xl text-text-label font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='p-4 bg-background-card w-100 rounded-2xl text-text-label font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
                />
                <input
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='p-4 bg-background-card w-100 rounded-2xl text-text-label font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
                />
                <button
                  type='submit'
                  className='bg-primary-accent w-100 p-4 rounded-lg mt-8 font-body font-semibold text-text-primary'
                >
                  Create account
                </button>
              </form>
            ) : (
              <form
                className='flex flex-col justify-center gap-4'
                onSubmit={handleLogin}
              >
                <input
                  type='text'
                  placeholder='Email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='p-4 bg-background-card w-100 rounded-2xl text-text-label font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='p-4 bg-background-card w-100 rounded-2xl text-text-label font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
                />
                <button
                  type='submit'
                  className='bg-primary-accent w-100 p-4 rounded-lg mt-8 font-body font-semibold text-text-primary'
                >
                  Sign in
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
