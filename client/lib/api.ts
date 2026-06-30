async function register(email: string, username: string, password: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function login(email: string, password: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

export { register, login };
