'use client';

import { useState } from 'react';

function LoginPage() {
  const [mode, setMode] = useState<'signup' | 'login'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className='bg-background-primary h-full'>
      <div className='flex h-full'>
        <div className=' flex-1'>text</div>
        <div className='w-lg flex flex-col justify-center'>
          <h2 className='text-text-primary font-headings text-2xl font-semibold'>
            Start your first pact today
          </h2>
          <form className='flex flex-col justify-center gap-4'>
            <input
              type='text'
              placeholder='Your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='p-4 bg-background-card w-100 rounded-lg text-text-label font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
            />
            <input
              type='text'
              placeholder='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='p-4 bg-background-card w-100 rounded-lg text-text-label font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='p-4 bg-background-card w-100 rounded-lg text-text-label font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
            />
            <input
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='p-4 bg-background-card w-100 rounded-lg text-text-label font-semibold border border-text-label focus:border-primary-accent focus:outline focus:outline-primary-accent'
            />
            <button className='bg-primary-accent w-100 p-4 rounded-lg mt-8'>
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
