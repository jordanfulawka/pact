CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  creator_id UUID NOT NULL CHECK (creator_id <> partner_id) REFERENCES users(id),
  partner_id UUID REFERENCES users(id),
  STATUS pact_status NOT NULL DEFAULT 'pending',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE CHECK (end_date IS NULL OR end_date >= start_date),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE pact_member_role AS ENUM ('creator', 'partner');

CREATE TABLE pact_members (
  pact_id UUID NOT NULL REFERENCES pacts(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role pact_member_role NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)