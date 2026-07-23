'use client';

import { useEffect, useState } from 'react';
import { Handshake } from 'lucide-react';
import { login as apiLogin, register as apiRegister } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';

const inputClasses =
  'p-3.5 bg-background-card w-100 rounded-xl text-text-primary font-semibold border border-text-label/40 transition-colors duration-150 focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/30';

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
  const { login, user } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const { token } = await apiLogin(email, password);
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
      if (password !== confirmPassword) {
        setError("Your passwords don't match!");
        return;
      }
      setLoading(true);
      const { token } = await apiRegister(name, username, email, password);
      login(token);
      setLoading(false);
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className='bg-background-primary min-h-screen'>
      <div className='flex min-h-screen justify-between'>
        <div className='flex-1 flex flex-col max-w-150'>
          <div className='flex items-center gap-4 pl-20 p-5'>
            <div className='p-2 w-fit bg-primary-accent rounded-lg'>
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

        <div className='w-lg flex flex-col items-center justify-center'>
          <div className='bg-background-selected w-100 flex rounded-md mb-6'>
            <button
              onClick={() => setMode('login')}
              className={`${mode === 'login' ? 'bg-primary-accent' : ''} flex-1 rounded-md p-2 transition-colors duration-300`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`${mode === 'signup' ? 'bg-primary-accent' : ''} flex-1 rounded-md p-2 transition-colors duration-300`}
            >
              Create account
            </button>
          </div>
          <div className='flex flex-col'>
            <h2 className='text-text-primary font-headings text-2xl font-semibold mb-6'>
              {mode === 'signup'
                ? 'Start your first pact today'
                : 'Welcome back!'}
            </h2>
            {mode === 'signup' ? (
              <form
                className='flex flex-col justify-center gap-3'
                onSubmit={handleRegister}
              >
                <input
                  type='text'
                  placeholder='Your name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClasses}
                />
                <input
                  type='text'
                  placeholder='Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClasses}
                />
                <input
                  type='text'
                  placeholder='Email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClasses}
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClasses}
                />
                <input
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClasses}
                />
                <button
                  type='submit'
                  className='bg-primary-accent w-100 p-4 rounded-lg mt-4 font-body font-semibold text-text-primary transition-transform duration-150 hover:brightness-110 active:scale-[0.98]'
                >
                  Create account
                </button>
              </form>
            ) : (
              <form
                className='flex flex-col justify-center gap-3'
                onSubmit={handleLogin}
              >
                <input
                  type='text'
                  placeholder='Email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClasses}
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClasses}
                />
                <button
                  type='submit'
                  className='bg-primary-accent w-100 p-4 rounded-lg mt-4 font-body font-semibold text-text-primary transition-transform duration-150 hover:brightness-110 active:scale-[0.98]'
                >
                  Sign in
                </button>
              </form>
            )}
            {error && <p className='text-red-500'>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
