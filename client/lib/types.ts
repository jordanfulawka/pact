interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

interface Pact {
  id: string;
  title: string;
  status: string;
  creator_id: string;
  partner_id: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export type { User, Pact };
