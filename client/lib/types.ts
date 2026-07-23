interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface Pact {
  id: string;
  created_at: string;
  creator_id: string;
  end_date: string | null;
  partner_avatar_url: string | null;
  partner_id: string;
  other_user_id: string;
  partner_name: string | null;
  partner_username: string | null;
  start_date: string | null;
  status: string;
  title: string;
  current_streak: number;
  longest_streak: number;
  duration_value: number;
  duration_unit: 'days' | 'weeks' | 'months';
}

export type { User, Pact };
