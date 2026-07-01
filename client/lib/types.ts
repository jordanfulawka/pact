interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

interface Pact {
  id: string;
  created_at: string;
  creator_id: string;
  end_date: string;
  partner_avatar_url: string | null;
  partner_id: string;
  partner_name: string | null;
  partner_username: string | null;
  start_date: string;
  status: string;
  title: string;
}

export type { User, Pact };
