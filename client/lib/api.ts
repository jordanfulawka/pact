async function register(
  name: string,
  username: string,
  email: string,
  password: string,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, username, email, password }),
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

async function handleCreatePact(
  token: string,
  title: string,
  partnerUsername: string,
  durationValue: number,
  durationUnit: 'days' | 'weeks' | 'months',
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      partnerUsername,
      durationValue,
      durationUnit,
    }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function getPacts(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pacts`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function acceptPact(token: string, pactId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/pacts/${pactId}/accept`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function rejectPact(token: string, pactId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/pacts/${pactId}/reject`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function checkIn(token: string, pactId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/pacts/${pactId}/checkIn`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function getCheckIn(token: string, pactId: string, userId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/pacts/${pactId}/checkIn?userId=${userId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function getCheckIns(token: string, pactId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/pacts/${pactId}/checkIns`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function getUserCheckIns(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/pacts/checkIns/today`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return response.json();
}

async function cancelPact(token: string, pactId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/pacts/${pactId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  return true;
}

export {
  register,
  login,
  handleCreatePact,
  getPacts,
  acceptPact,
  rejectPact,
  checkIn,
  getCheckIn,
  getCheckIns,
  cancelPact,
  getUserCheckIns,
};
