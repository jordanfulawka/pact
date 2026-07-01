CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE pact_status as ENUM ('pending', 'active', 'completed', 'broken');

CREATE TABLE pacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  creator_id UUID NOT NULL CHECK (creator_id <> partner_id) REFERENCES users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES users(id),
  STATUS pact_status NOT NULL DEFAULT 'pending',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE CHECK (end_date IS NULL OR end_date >= start_date),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE pact_member_role AS ENUM ('creator', 'partner');

CREATE TABLE pact_members (
  pact_id UUID NOT NULL REFERENCES pacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  role pact_member_role,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY(pact_id, user_id)
);

CREATE TABLE check_ins(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pact_id UUID NOT NULL REFERENCES pacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE DEFAULT CURRENT_DATE,
  UNIQUE(pact_id, user_id, date)
);

CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pact_id UUID NOT NULL UNIQUE REFERENCES pacts(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
  last_completed_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE invite_tokens(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pact_id UUID NOT NULL REFERENCES pacts(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + INTERVAL '7 days' ,
  used_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_pact_members_user_id ON pact_members(user_id);

CREATE INDEX idx_check_ins_pact_id ON check_ins(pact_id);
CREATE INDEX idx_check_ins_user_id ON check_ins(user_id);