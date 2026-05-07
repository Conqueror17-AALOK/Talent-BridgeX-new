-- TALENT-BRIDGEX CONSOLIDATED DATABASE SETUP
-- ============================================================
-- Use this file to set up your entire database in one go.
-- Ideal for Supabase SQL Editor or direct psql execution.

-- ============================================================
-- 1. TABLES & VIEWS
-- ============================================================

-- Profiles (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  university TEXT,
  country TEXT,
  field_of_study TEXT,
  year_of_study TEXT,
  career_interest TEXT,
  bio TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  avatar_url TEXT,                -- Profile photo (Supabase Storage public URL)
  reputation INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Skill Profiles
CREATE TABLE IF NOT EXISTS skill_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scores JSONB NOT NULL DEFAULT '{}', -- e.g., {"technical": 78, "soft": 92}
  strengths TEXT[],
  gaps TEXT[],
  last_assessment_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Roadmaps
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content JSONB NOT NULL, -- The AI-generated roadmap JSON
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Modules
CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY, -- e.g., 'sys-arch-101'
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  level TEXT,
  prerequisites TEXT[],
  content TEXT, -- Markdown/HTML
  video_url TEXT,
  quiz JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Module Progress
CREATE TABLE IF NOT EXISTS module_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES modules(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed'
  quiz_score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, module_id)
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'University', 'Community'
  domain TEXT,
  description TEXT,
  team_size INTEGER,
  current_members INTEGER DEFAULT 1,
  posted_by UUID REFERENCES profiles(id),
  location TEXT,
  skills TEXT[],
  status TEXT DEFAULT 'Open',
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Opportunities
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Internships', -- 'Internships', 'Freelance', 'Connection', 'Collaboration'
  location TEXT,
  domain TEXT,
  stipend TEXT,
  duration TEXT,
  requirements_vector JSONB, -- For AI matching
  skills TEXT[],
  description TEXT,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Alias view so /api/jobs route still works
CREATE OR REPLACE VIEW jobs AS SELECT * FROM opportunities;

-- Opportunity Applications
CREATE TABLE IF NOT EXISTS opportunity_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'applied', -- 'applied', 'shortlisted', 'rejected', 'accepted'
  ai_match_score INTEGER,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(opportunity_id, user_id)
);

-- Community Groups
CREATE TABLE IF NOT EXISTS community_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  description TEXT,
  creator_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Messages (Chat)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES community_groups(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================
-- 2. RLS POLICIES
-- ============================================================

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 2.1 Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2.2 Skill Profiles
DROP POLICY IF EXISTS "Skill profiles viewable by owner." ON skill_profiles;
DROP POLICY IF EXISTS "Skill profiles managed by owner." ON skill_profiles;

CREATE POLICY "Skill profiles viewable by owner." ON skill_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Skill profiles managed by owner." ON skill_profiles FOR ALL USING (auth.uid() = user_id);

-- 2.3 Roadmaps
DROP POLICY IF EXISTS "Roadmaps are viewable by owner." ON roadmaps;
DROP POLICY IF EXISTS "Roadmaps can be managed by owner." ON roadmaps;

CREATE POLICY "Roadmaps are viewable by owner." ON roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Roadmaps can be managed by owner." ON roadmaps FOR ALL USING (auth.uid() = user_id);

-- 2.4 Modules
DROP POLICY IF EXISTS "Modules are publicly readable." ON modules;
CREATE POLICY "Modules are publicly readable." ON modules FOR SELECT USING (true);

-- 2.5 Module Progress
DROP POLICY IF EXISTS "Module progress is private to user." ON module_progress;
DROP POLICY IF EXISTS "Module progress managed by user." ON module_progress;

CREATE POLICY "Module progress is private to user." ON module_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Module progress managed by user." ON module_progress FOR ALL USING (auth.uid() = user_id);

-- 2.6 Projects
DROP POLICY IF EXISTS "Projects are publicly readable." ON projects;
DROP POLICY IF EXISTS "Project creators can manage their projects." ON projects;

CREATE POLICY "Projects are publicly readable." ON projects FOR SELECT USING (true);
CREATE POLICY "Project creators can manage their projects." ON projects FOR ALL USING (auth.uid() = posted_by);

-- 2.7 Opportunities
DROP POLICY IF EXISTS "Opportunities are publicly readable." ON opportunities;
CREATE POLICY "Opportunities are publicly readable." ON opportunities FOR SELECT USING (true);

-- 2.8 Applications
DROP POLICY IF EXISTS "Applications are private to user." ON opportunity_applications;
DROP POLICY IF EXISTS "Users can manage their own applications." ON opportunity_applications;

CREATE POLICY "Applications are private to user." ON opportunity_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own applications." ON opportunity_applications FOR ALL USING (auth.uid() = user_id);

-- 2.9 Community Groups
DROP POLICY IF EXISTS "Community groups are publicly readable." ON community_groups;
DROP POLICY IF EXISTS "Creators can manage their groups." ON community_groups;

CREATE POLICY "Community groups are publicly readable." ON community_groups FOR SELECT USING (true);
CREATE POLICY "Creators can manage their groups." ON community_groups FOR ALL USING (auth.uid() = creator_id);

-- 2.10 Messages
DROP POLICY IF EXISTS "Messages are readable by group members." ON messages;
DROP POLICY IF EXISTS "Users can send messages." ON messages;

CREATE POLICY "Messages are readable by group members." ON messages FOR SELECT USING (true);
CREATE POLICY "Users can send messages." ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ============================================================
-- 3. FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
